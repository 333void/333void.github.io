const rows = ['ratios', 'freqs']
const ratios = ['1/1', '4/3', '3/2', '5/3'];
const harmonics = 32;


// document.getElementById('rootfreq').value

// return a formatted number of the root times the ratio
function rootRate(root, rate) {
  let freq = (root * rate.split('/')[0]) / rate.split('/')[1];
  if (!Number.isInteger(freq)) {
    // multiply remainder by denominator and round (to the 5th decimal place) to get fraction numerator and then put over denom in string
    return Math.floor(freq) + ' ' + (Math.round(((freq - Math.floor(freq)) * rate.split('/')[1]) * 100000) / 100000) + '/' + rate.split('/')[1]
  } else {
    return freq
  }
}

function draw() {
  const canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let graphPadding = 40;
    let graphWidth = canvas.width - (graphPadding * 2);
    let graphRowHeight = 50;

    for (let row = 1; row < harmonics + 1; row++) {
      for (let point = 0; point < row; point++) {
        if (point != 0 || row == 1) {
          ctx.beginPath();
          ctx.arc(graphPadding + ((graphWidth / (row)) * point), graphRowHeight * (row), 4, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fillStyle = "rgb(200 200 200)";
          if (point != 0 && point != 1) {
            // calculate if ratio can be simplified
            for (let m = 2; m <= row / 2; m++) {
              if (point % m == 0 && row % m == 0) {
                ctx.fillStyle = "rgb(128 128 128 / 25%)";
              }
            }
          }
          ctx.fill();

          ctx.font = "10px Arial";
          ctx.fillText((point + row) + '/' + row, (graphPadding + ((graphWidth / (row)) * point)) + 4, (graphRowHeight * (row)) - 6);
        }
      }
    }
    
    
    
    /*ctx.beginPath();
    ctx.moveTo(graphPadding + 5, 55)
    ctx.bezierCurveTo(graphPadding, 70, graphPadding + graphWidth, 70, graphPadding + graphWidth, 50);
    ctx.strokeStyle = "yellow";
    ctx.stroke();*/
  }
}

function createTable(root) {
  const t = document.getElementById('table');
  t.innerHTML = '';
  for (let i = 0; i < rows.length; i++) {
    // create row
    let tr = document.createElement('tr');
    tr.id = rows[i];
    for (let j = 0; j < ratios.length; j++) {
      let td = document.createElement('td');
      td.id = rows[i] + ratios[j];
      if (rows[i] == 'ratios') {
        td.innerHTML = ratios[j];
      }
      if (rows[i] == 'freqs') {
        td.innerHTML = rootRate(root, ratios[j])
      }
      tr.appendChild(td)
    }
    t.appendChild(tr)
  }
}

function load() {
  document.getElementById('rootfreq').addEventListener('input', (e) => {
    createTable(document.getElementById('rootfreq').value)
    draw();
  })
}

window.addEventListener('load', (e) => {
  load()
})


//