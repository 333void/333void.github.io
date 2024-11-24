import { cfg } from "./config.js"
import { bSVGElement } from "../../utils/bNodes.js";
import escapeCharacters from "../../utils/escapeCharacters.js";

console.log(cfg)
const rows = ['ratios', 'freqs']
const ratios = ['1/1', '4/3', '3/2', '5/3'];

let onBalls = [];

// frequency representation object class
class Frequency {
  constructor ({root, octave, numer, denom}) {
    this.root = root;
    this.octave = octave;
    this.octaveRoot = this.root * Math.pow(2, this.octave);
    this.numer = numer;
    this.denom = denom;
  }

  get rate() {
    return this.numer / this.denom;
  }

  get value() {
    return this.octaveRoot * this.numer / this.denom;
  }

  get rootRate() {
    return `${this.octaveRoot}(${this.numer}/${this.denom})`
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

class Instrument {
  constructor () {
    this.context = new AudioContext();
  }

  createNote(freq) {
    let osc = this.context.createOscillator();
    let gain = this.context.createGain();
    osc.type = "sine";
    osc.frequency.value = freq.value;
    osc.connect(gain);
    gain.connect(this.context.destination);
    return {osc, gain}
  }

  on(note) {
    note.osc.start()
  }

  off(note) {
    note.osc.stop();
  }

  play(note) {
    note.osc.start()
    note.gain.gain.exponentialRampToValueAtTime(
      0.00001, context.currentTime + 0.04
    )
  }
}

// check is fraction can be simplified
function GCMChecker(numer, denom) {
  // denom / 2: GCD cannot be more than half the denominator
  for (let i = 2; i <= Math.ceil(denom / 2) + 1; i++) {
    if (numer % i == 0 && denom % i == 0) {
      return i;
    }
  }
  // if numerator is a multiple of the denominator (e.g. 14/7)
  if (numer % denom == 0 && denom != 1) {
    return denom;
  }
}

function GCMDissolver(numer, denom) {
  let dNumer = numer;
  let dDenom = denom;
  // GCD solver (repeat until smallest divisor reached)
  while (GCMChecker(dNumer, dDenom)) {
    let divisor = GCMChecker(dNumer, dDenom);
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

// compare size of freq for ratioBetween (since larger freq always comes first)
function freqCompare(freq1, freq2) {
  let freqGreater, freqLesser, mult;

  // find which freq is greater
  if (freq1.value > freq2.value) {
    freqGreater = freq1;
    freqLesser = freq2;
    mult = freq1.root / freq2.root;
  } else {
    freqGreater = freq2;
    freqLesser = freq1;
    mult = freq2.root / freq1.root;
  }

  return [
    (freqGreater.numer * mult * freqLesser.denom),
    (freqLesser.numer * freqGreater.denom)
  ]
}

function killLines(id) {
  // weird bug with for loops and document children. children seem to be stored by the index number, and if the children list is shortened during loop (i.e. .remove()) for loop will skip last child.
  let arr = [];
  for (const child of document.getElementById("cool-lines").children) {
    arr.push(child.id)
  }
  for (const childId of arr) {
    if (childId.indexOf(id) > -1) {
      document.getElementById(childId).remove();
    }
  }
}

function drawLines(freq, otherFreqs) {
  let ball = document.getElementById(freq.rootRate);

  for (const otherFreq of otherFreqs) { // attach to all activated balls
    let otherBall = document.getElementById(otherFreq.rootRate);
    let dRate = freqCompare(freq, otherFreq);
    let GCMRate = GCMDissolver(dRate[0], dRate[1]);

    document.getElementById("cool-lines").append(
      new bSVGElement({
        tag: 'line',
        attributes: {
          id: `${ball.id}-${otherBall.id}`,
          x1: ball.cx.baseVal.value,
          y1: ball.cy.baseVal.value,
          x2: otherBall.cx.baseVal.value,
          y2: otherBall.cy.baseVal.value,
          stroke: 'white',
        },
      }).set(),
      new bSVGElement({
        tag: 'text',
        innerHTML: `${GCMRate[0]}/${GCMRate[1]}`,
        attributes: {
          id: `ratio_${ball.id}-${otherBall.id}`,
          x: (ball.cx.baseVal.value + otherBall.cx.baseVal.value) / 2,
          y: (ball.cy.baseVal.value + otherBall.cy.baseVal.value) / 2,
          fill: 'white',
        },
      }).set()
    )
  }
}

function activateBalls(freqs) {
  let sine = new Instrument();

  for (const freq of freqs) {
    let id = freq.rootRate;
    let ball = document.getElementById(id);

    ball.addEventListener("mouseover", () => {
      console.log(freq.rootRate)
      let num = freq.numer * 3;
      let den = freq.denom * 2;
      let arr = GCMDissolver(num, den)
      let ele = document.getElementById(`${freq.octaveRoot}(${arr[0]}/${arr[1]})`)
      console.log(`${freq.octaveRoot}(${arr[0]}/${arr[1]})`)
    })

    ball.addEventListener("mousedown", () => {


      if (ball.getAttribute('name') != 'onBall') {
        var note = sine.createNote(freq);
        note.osc.start();
        
        ball.setAttribute('stroke', 'yellow');
        ball.addEventListener('mousedown', dieBall)
        ball.setAttribute('name', 'onBall');
        document.getElementById('rootfreq').addEventListener('input', dieBall)
        drawLines(freq, onBalls);
        onBalls.push(freq);
      }

      function dieBall() {
        if (ball.getAttribute('name') == 'onBall') {
          note.osc.stop();
          ball.removeEventListener('mousedown', dieBall);
          killLines(ball.id);
          ball.setAttribute('stroke', 'white');
          ball.setAttribute('name', '');
          // remove ball id from active balls array (stops new lines from attaching to it)
          onBalls = onBalls.filter((freq) => freq.rootRate != ball.id);
          // fade volume
        }
      }

    })
  }
}

function draw(root) {
  // change for lower octave rendered slider
  root /= 2;
  for (const child of document.getElementById('canvas').children) {
    child.innerHTML = '';
  }
  // equal temperment ref lines

  for (let note = 0; note < ((12 * cfg.octavesDisplayed) + 1); note++) {
    document.getElementById('lines').appendChild(new bSVGElement({
      tag: 'rect',
      attributes: {
        id: `line-${note}`,
        // subtract graphwidthunit to get the x inside of the total graph width
        x: cfg.graphPadding + ((cfg.graphWidthUnit) * Math.pow(2, note / 12) - cfg.graphWidthUnit) - (cfg.dotRadius / 4),
        y: cfg.graphPadding,
        width: cfg.dotRadius / 2,
        height: cfg.graphHeight,
        fill: 'rgb(50, 50, 50)',
      },
    }).set());
  }
  //(graphWidth / 2) * Math.pow(2, x / 12)
  
  // balls
  
  let sRT = !document.getElementById('sameratetoggle').checked;
  let rendered = [];

  // render multiple for diff octaves
  for (let octave = 0; octave < cfg.octavesDisplayed; octave++) {
    for (let row = 1; row < cfg.harmonics + 1; row++) {
      for (let point = 0; point < row; point++) {
        // point + row in the numerator param bc ratios are expressed as 1 + the amount above root (e.g. 3/2 is 1 + 1/2)
        let freq = new Frequency({
          root, octave,
          numer: point + row, 
          denom: row
        });

        dotdraw: if (point != 0 || row == 1) {
          let dot = document.createElement('circle');
          dot.setAttribute('stroke', 'white');
          dot.setAttribute('fill-opacity', '0%');
  
          // check if ratio can be simplified
          if (GCMChecker(point, row)) {
            if (sRT) {
              break dotdraw
            }
            dot.setAttribute('fill-opacity', '20%');
          }

          // IM SORRY MEMORY I HAVE TO (svg cannot add event listeners until after rendering)
          rendered.push(freq)
  
          dot.setAttribute('id', freq.rootRate);
          dot.setAttribute('cx', cfg.graphPadding + (cfg.graphWidthUnit * Math.pow(2, octave) - cfg.graphWidthUnit) + (((cfg.graphWidthUnit / row) * point) * Math.pow(2, octave)));
          dot.setAttribute('cy', cfg.graphRowHeight * row);
          dot.setAttribute('r', cfg.dotRadius);
          
  
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

window.addEventListener('load', () => {
  if (document.getElementById('rootfreq').value) {
    let root = document.getElementById('rootfreq').value;
    createTable(root);
    draw(root);
  }
  document.getElementById('rootfreq').addEventListener('input', (e) => {
    let root = document.getElementById('rootfreq').value;
    createTable(root);
    draw(root);
  })
  document.getElementById('sameratetoggle').addEventListener('input', (e) => {
    let root = document.getElementById('rootfreq').value;
    draw(root);
  })
})