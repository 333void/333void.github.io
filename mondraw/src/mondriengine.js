function paint(config, id) {
  const { rows, columns, colors, colorProbability, maxRectWidth, maxRectHeight, strokeSize } = config;
  // change

  // canvas
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");

  // globals to simplify functions
  const width = canvas.width / rows;
  const height = canvas.height / columns;
  const colorProbAsc = ascendMap(colorProbability);

  // create a matrix to call for available space inside of canvas to draw
  const availableSpace = (function () { // create an empty matrix (rows x columns)
    let matrix = [];
    for (let h = 0; h < columns; h++) {
      matrix[h] = []; // create new table for each matrix row per height divisor
      for (let w = 0; w < rows; w++) {
        matrix[h][w] = 0; // create new item in row table per width divisor
      }
    }
    return matrix;
  })();

  // change probability to work with random color function
  function ascendMap(array) {
    let arrayCopy = [...array]
    for (let i = 0; i < arrayCopy.length; i++) {
      if (i > 0) {
        arrayCopy[i] = arrayCopy[i] + arrayCopy[i - 1];
      }
    }
    return arrayCopy;
  }

  // random function for picking fill colors
  function getRandomColor() {
    n = Math.random() * colorProbAsc[colorProbAsc.length - 1]; // .length - 1 is the total, so multiplied makes it a random # from 0 to the total
    for (let i = 0; i < colorProbAsc.length; i++) {
      if (n < colorProbAsc[i]) { // repeat until rand # is lower than a # in the acending probability array
        return i;
      }
    }
  }

  // fill in with random color
  function fill(rect) {
    let color = colors[getRandomColor()];
    ctx.fillStyle = color;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    if (strokeSize > 0) { // because of stupid canvas programming a value of 0 is registered as 1, for some reason
      ctx.lineWidth = strokeSize;
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    }
  }

  // generate shape (size)
  function generateShape(w, h) {
    //console.log("position", w, h)
    // random size generation
    let widthUnits = Math.ceil(Math.random() * maxRectWidth);
    let heightUnits = Math.ceil(Math.random() * maxRectHeight);
    //console.log("unitspre", widthUnits, heightUnits)
    // see if shape can fit inside availability
    for (let hMap = 0; hMap < heightUnits; hMap++) { // iterate over height units
      // if height exceeds matrix length, shorten height
      if (h + hMap == availableSpace.length) { 
        heightUnits = hMap; 
        //console.log("height edge clipped", heightUnits); 
        break 
      }; 
      let maxWidth = -1;
      for (let wMap = 0; wMap < widthUnits; wMap++) {
        // if larger than matrix, clip width
        if (w + wMap == availableSpace[h + hMap].length) { 
          widthUnits = wMap; 
          //console.log("width edge clipped", widthUnits); 
          break 
        }; 
        // if space in unavailable
        if (availableSpace[h + hMap][w + wMap] == 1 && maxWidth == -1) { maxWidth = wMap }
        //console.log("maxwidth", maxWidth)
      };
      //console.log("prewash width", widthUnits, "height", heightUnits)
      // change size if space unavailable
      if (maxWidth != -1) {
        if (maxWidth != 0) { // not the first in array
          if (Math.random() > 0.5) {
            //console.log("wwwww")
            widthUnits = maxWidth; 
          } else {
            //console.log("www else")
            if (hMap > 0) {
              //console.log("mo zero")
              heightUnits = hMap;          
            } else {
              //console.log("no zero")
              heightUnits = 1;
              widthUnits = maxWidth; 
            }
          }
        } else { // first in array, cannot make height go any further, truncate
          //console.log("fff")
          heightUnits = hMap;
        }
      }
    };
    
    // update availability matrix with square
    for (let hMap2 = 0; hMap2 < heightUnits; hMap2++) {
      for (let wMap2 = 0; wMap2 < widthUnits; wMap2++) {
        availableSpace[h + hMap2][w + wMap2] = 1;
      }
    }

    // create rectangle dimenstions for canvas
    rect = {
      x: width * w,
      y: height * h,
      w: width * widthUnits,
      h: height * heightUnits,
    };
    fill(rect);
    console.table();
  }

  // search for empty spots to generate in
  for (let h = 0; h < availableSpace.length; h++) {
    for (let w = 0; w < availableSpace[h].length; w++) {
      if (availableSpace[h][w] == 0) {
        generateShape(w, h)
      }
    }
  }
}

// auto draw
window.addEventListener("load", (event) => {
  for (const id of config.elementIds) {
    paint(config, id)
  }
});