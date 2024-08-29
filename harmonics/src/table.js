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

function find() {
  const balls = document.querySelectorAll("circle");
  console.log(balls[0])
  for (let i = 0; i < balls.length; i++) {
    balls[i].addEventListener("mousedown", () => {
      balls[i].setAttribute('fill', 'yellow');
    })
  }


}

function draw() {
  const svg = document.getElementById("canvas");
  svg.innerHTML = '';

  let graphPadding = 40;
  let graphWidth = svg.getAttribute('width') - (graphPadding * 2);
  let graphRowHeight = 50;

  for (let row = 1; row < harmonics + 1; row++) {
    for (let point = 0; point < row; point++) {
      if (point != 0 || row == 1) {
        let dot = document.createElement('circle');
        dot.setAttribute('id', point + '/' + row);
        dot.setAttribute('cx', graphPadding + ((graphWidth / (row)) * point));
        dot.setAttribute('cy', graphRowHeight * row);
        dot.setAttribute('r', 10);
        dot.setAttribute('fill', 'green');

        // find if ratio can be simplified
        for (let m = 2; m <= row / 2; m++) {
          if (point % m == 0 && row % m == 0) {
            dot.setAttribute('fill-opacity', '0%')
            // SET BREAK
          }
        }

        

        svg.innerHTML += dot.outerHTML;

        
        
        //ctx.font = "10px Arial";
        //ctx.fillText((point + row) + '/' + row, (graphPadding + ((graphWidth / (row)) * point)) + 4, (graphRowHeight * (row)) - 6);
      }
    }
  }
  find();
  
  
  /*ctx.beginPath();
  ctx.moveTo(graphPadding + 5, 55)
  ctx.bezierCurveTo(graphPadding, 70, graphPadding + graphWidth, 70, graphPadding + graphWidth, 50);
  ctx.strokeStyle = "yellow";
  ctx.stroke();*/
}

// root * Math.pow(2, x / 12)

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
    let root = document.getElementById('rootfreq').value;
    createTable(root);
    draw();
    
  })
}

window.addEventListener('load', (e) => {
  load()
})


//