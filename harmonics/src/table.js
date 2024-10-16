const rows = ['ratios', 'freqs']
const ratios = ['1/1', '4/3', '3/2', '5/3'];
const harmonics = 10;

let onBalls = [];

// frequency representation object class
class Frequency {
  constructor (root, numer, denom) {
    this.root = root;
    this.numer = numer;
    this.denom = denom;
  }

  get value() {
    return this.root * this.numer / this.denom;
  }

  get rootRate() {
    return `${this.root}(${this.numer}/${this.denom})`
  }

  get rootFrac() {
    return this.calcRootFrac();
  }

  calcRootFrac() {
    /*let freq = (root * (rate.split('/')[0]) / rate.split('/')[1]);
    // if the number is not whole, create the fraction
    if (!Number.isInteger(freq)) {
      // multiply remainder by denominator and round (to the 5th decimal place) to get fraction numerator and then put over denom in string
      return Math.floor(freq) + ' ' + (Math.round(((freq - Math.floor(freq)) * rate.split('/')[1]) * 100000) / 100000) + '/' + rate.split('/')[1]
    } else {
      return freq
    }*/
  }
}

// check is fraction can be simplified
function simpChecker(numer, denom) {
  //console.log(Math.ceil(denom / 2))
  // denom / 2: GCD cannot be more than half the denominator
  for (let i = 2; i <= Math.ceil(denom / 2) + 1; i++) {
    if (numer % i == 0 && denom % i == 0) {
      return i;
    }
  }
}

function simpDissolver(numer, denom) {
  let dNumer = numer;
  let dDenom = denom;
  while (simpChecker(dNumer, dDenom)) {
    let divisor = simpChecker(dNumer, dDenom);
    dNumer = dNumer / divisor;
    dDenom = dDenom / divisor;
  };
  return [dNumer, dDenom];
}

// return a formatted number of the root times the ratio
function rootFrac(root, rate) {
  let freq = (root * (rate.split('/')[0]) / rate.split('/')[1]);
  // if the number is not whole, create the fraction
  if (!Number.isInteger(freq)) {
    // multiply remainder by denominator and round (to the 5th decimal place) to get fraction numerator and then put over denom in string
    return Math.floor(freq) + ' ' + (Math.round(((freq - Math.floor(freq)) * rate.split('/')[1]) * 100000) / 100000) + '/' + rate.split('/')[1]
  } else {
    return freq
  }
}

function activateBalls(freqs) {
  for (const freq of freqs) {
    let id = freq.rootRate;
    let ball = document.getElementById(id);   

    ball.addEventListener("mousedown", () => {
      // audio stuff
      let context = new AudioContext();
      let o = context.createOscillator()
      let g = context.createGain()
      o.type = "sine"
      o.frequency.value = freq.value;
      o.connect(g)
      g.connect(context.destination)

      if (ball.getAttribute('name') != 'onBall') {
        o.start();
        ball.setAttribute('fill', 'yellow');
        ball.addEventListener('mousedown', dieBall)
        ball.setAttribute('name', 'onBall');
        document.getElementById('rootfreq').addEventListener('input', dieBall)
        drawLines(freq, onBalls);
        onBalls.push(freq);
      }

      function dieBall() {
        if (ball.getAttribute('name') == 'onBall') {
          ball.removeEventListener('mousedown', dieBall);
          killLines(ball.id);
          ball.setAttribute('fill', 'green');
          ball.setAttribute('name', '');
          // remove ball id from active balls array (stops new lines from attaching to it)
          onBalls = onBalls.filter((rR) => rR.rootRate != ball.id);
          // fade volume
          g.gain.exponentialRampToValueAtTime(
            0.00001, context.currentTime + 1
          )
          o.stop(context.currentTime + 0.5)
        }
      }
    })
  }
}

function killLines(id) {
  let activeLines = document.getElementById('cool-lines').querySelectorAll('line')

  for (let i = 0; i < activeLines.length; i++) {
    if (activeLines[i].id.includes(id)) {
      // delete line elements
      document.getElementById(activeLines[i].id).remove();
    }
  }
}

function drawLines(freq, otherFreqs) {
  let ball = document.getElementById(freq.rootRate);

  // freqGreater is always the larger number
  function ratioBetween(freqGreater, freqLesser, mult = 1) {
    // cross multiply
    console.log((freqGreater.numer * mult * freqLesser.denom) + '/' + (freqLesser.numer * freqGreater.denom), simpDissolver((freqGreater.numer * mult * freqLesser.denom), (freqLesser.numer * freqGreater.denom)))
  }

  // compare size of freq for ratioBetween (since larger freq always comes first)
  function freqCompare(freq1, freq2) {
    // if two freqs are not part of the same root group, find which root is bigger
    if (freq1.root != freq2.root) {
      if (freq1.root > freq2.root) {
        return ratioBetween(freq1, freq2, freq1.root / freq2.root);
      } else {
        return ratioBetween(freq2, freq1, freq2.root / freq1.root);
      }
    } else { 
      // if part of same root group, find which ratio is bigger
      if (freq1.numer / freq1.denom > freq2.numer / freq2.denom) {
        return ratioBetween(freq1, freq2);
      } else {
        return ratioBetween(freq2, freq1);
      }
    }
  }



  for (const otherFreq of otherFreqs) {
    let otherBall = document.getElementById(otherFreq.rootRate);
    let line = document.createElement('line');

    freqCompare(freq, otherFreq);

    line.setAttribute('id', ball.id + otherBall.id);
    line.setAttribute('x1', ball.cx.baseVal.value);
    line.setAttribute('y1', ball.cy.baseVal.value);
    line.setAttribute('x2', otherBall.cx.baseVal.value);
    line.setAttribute('y2', otherBall.cy.baseVal.value);
    line.setAttribute('stroke', 'white');

    document.getElementById("cool-lines").innerHTML += line.outerHTML;
  }
}

function draw(root) {
  // change for lower octave rendered slider
  root /= 2;

  // initialize canvas element
  const svg = document.getElementById("canvas");
  svg.innerHTML = '';
  const gees = ['lines', 'balls', 'cool-lines'];
  for (const g of gees) {
    let oG = document.createElement('g');
    oG.id = g;
    svg.innerHTML += oG.outerHTML;
  }

  let graphPadding = 40;
  let graphWidth = (svg.getAttribute('width') - (graphPadding * 2));
  let graphHeight = svg.getAttribute('height') - (graphPadding * 2);
  let graphRowHeight = 50;

  let octavesDisplayed = 3;
  // decreases exponentially (minus one because of series being {1, 3, 7, 15})
  let graphWidthUnit = graphWidth / (Math.pow(2, octavesDisplayed) - 1)

  let dotRadius = 10;
    
  // equal temperment ref lines

  for (let note = 0; note < ((12 * octavesDisplayed) + 1); note++) {
    let line = document.createElement('rect');

    // subtract graphwidthunit to get the x inside of the total graph width
    line.setAttribute('x', graphPadding + ((graphWidthUnit) * Math.pow(2, note / 12) - graphWidthUnit) - (dotRadius / 4));
    line.setAttribute('y', graphPadding);
    line.setAttribute('width', dotRadius / 2);
    line.setAttribute('height', graphHeight);
    line.setAttribute('fill', 'rgb(50, 50, 50)');

    document.getElementById('lines').innerHTML += line.outerHTML;
  }
  //(graphWidth / 2) * Math.pow(2, x / 12)
  
  // balls
  
  let sRT = !document.getElementById('sameratetoggle').checked;
  let rendered = [];

  // render multiple for diff octaves
  for (let octave = 0; octave < octavesDisplayed; octave++) {
    for (let row = 1; row < harmonics + 1; row++) {
      for (let point = 0; point < row; point++) {
        // point + row in the numerator param bc ratios are expressed as 1 + the amount above root (e.g. 3/2 is 1 + 1/2)
        let freq = new Frequency(root * (Math.pow(2, octave)), point + row, row);

        dotdraw: if (point != 0 || row == 1) {
          let dot = document.createElement('circle');
          dot.setAttribute('fill', 'green');
  
          // check if ratio can be simplified
          if (simpChecker(point, row)) {
            if (sRT) {
              break dotdraw
            }
            dot.setAttribute('fill-opacity', '20%');
          }

          // IM SORRY MEMORY I HAVE TO (svg cannot add event listeners until after rendering)
          rendered.push(freq)
  
          dot.setAttribute('id', freq.rootRate);
          dot.setAttribute('cx', graphPadding + (graphWidthUnit * Math.pow(2, octave) - graphWidthUnit) + (((graphWidthUnit / row) * point) * Math.pow(2, octave)));
          dot.setAttribute('cy', graphRowHeight * row);
          dot.setAttribute('r', dotRadius);
          
  
          document.getElementById('balls').innerHTML += dot.outerHTML;
  
          
          
          //ctx.font = "10px Arial";
          //ctx.fillText((point + row) + '/' + row, (graphPadding + ((graphWidth / (row)) * point)) + 4, (graphRowHeight * (row)) - 6);
        }
      }
    }
    activateBalls(rendered);
  }
  
  
  



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
        td.innerHTML = rootFrac(root, ratios[j])
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
    draw(root);
  })
  document.getElementById('sameratetoggle').addEventListener('input', (e) => {
    let root = document.getElementById('rootfreq').value;
    draw(root);
  })
}

window.addEventListener('load', (e) => {
  load()
})