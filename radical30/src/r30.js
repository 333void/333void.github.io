import { bElement, bSVGElement } from "../../utils/bNodes.js";
import { rads } from "./r30.data.js"

/*
//  DATA 2 SVG ELEMENT
*/

// measurement object class
class m {
  constructor(a /* smaller */, b /* larger */) {
    this.a = a;
    this.b = b;
    this.ab = b - a;
  }

  x(n) {
    return this.a + this.ab * n;
  }
}

function line(box, rad, xy = 'xy') {
  /*
    let dx = 0;
    let dy = 0;
    if (d) {
      // reciprocal of box diagonal * size of line - size of line [to make ROC inversely proportional]
      let roc = w.ab * (h.ab / w.ab * 0.25 - 0.25);
      // change sign for inverted slope 
      if (1 < Math.abs(c[2][1] - c[1][1] / c[2][0] - c[1][0])) {
        roc = roc * -1;
      }

      dx = roc;
      dy = -roc;

      if (h.x(c[2][1]) + dy > height || h.x(c[2][1]) + dy < baseHeight) {
        //let lessenFactor = (h.x(c[2][1]) + dy) - height;
        let lessenFactor = Math.abs(((h.ab - w.ab) + 230) / 2);


        console.log(dy, h.x(c[2][1]), (h.x(c[2][1]) + dy), height)

        console.log(lessenFactor, ((h.ab - w.ab) + 230) / 2)


        dx -= lessenFactor * (h.ab / w.ab);
        dy -= lessenFactor;
      }

      function lFactor(mM, d, m) {
        if (mM + d > m) {
          let lessenFactor = (w.x(c[2][0]) + dx) - width;
          console.log('w', lessenFactor)
          dx -= lessenFactor;
          dy -= lessenFactor * (w.ab / h.ab);
        }
      }

      // shorten up line if out of bounds of the box
      if (w.x(c[2][0]) + dx > width) {
        let lessenFactor = (w.x(c[2][0]) + dx) - width;
        console.log('w', lessenFactor)
        dx -= lessenFactor;
        dy -= lessenFactor * (w.ab / h.ab);
      }
      if (h.x(c[2][1]) + dy > height || h.x(c[2][1]) + dy < baseHeight) {
        let lessenFactor = (h.x(c[2][1]) + dy) - height;
        console.log('w', lessenFactor)
        dx -= lessenFactor * (h.ab / w.ab);
        dy -= lessenFactor;
      } 
    }

    if (false) {
      // if height of box is shorter than length of box
      if (h.ab < w.ab) {
        dx = 
          // total x length of box * total x length of line
          (w.ab * (c[2][0] - c[1][0])) 
          // x^2 - 1, x from 1 to 0 using the slope
          * (((h.ab / w.ab) ** 2) - 1);
      } else {
        dy = (h.ab * (c[2][1] - c[1][1])) * (((w.ab / h.ab) ** 2) - 1);        
      }
    }
  */ 

  //let { x1, y1, x2, y2 } = box.points(rad.xy)

  /*console.log(box.m + (
    box.dx * rad.xy[0][0]),
    box.m + (box.dy * rad.xy[0][1]),
    box.m + (box.dx * rad.xy[1][0]),
    box.m + (box.dy * rad.xy[1][1]),
  )*/

  return new bSVGElement({
    tag: 'line',
    attributes: {
      class: "r30",
      x1: box.ox + (box.dx * rad[xy][0][0]),
      y1: box.oy + (box.dy * rad[xy][0][1]),
      x2: box.ox + (box.dx * rad[xy][1][0]),
      y2: box.oy + (box.dy * rad[xy][1][1]),
    },
  }).set();
}

function polyline(box, ...polyOrder) {
  let points = [];

  if (polyOrder > 1) {
    for (const radbit of polyOrder) {
      //console.log('c', radbit[0])
      // add x,y points in order specified by polyPocket function
      for (let i = 1; i < radbit.length; i++) {
        //console.log('i', radbit[0].xy[radbit[i]])
        points.push(
          box.ox + (box.dx * radbit[0].xy[radbit[i]][0]),
          box.oy + (box.dy * radbit[0].xy[radbit[i]][1])
        )
      }
    }
  } else {
    for (let lo of polyOrder[0].points) {
      points.push(
        box.ox + (box.dx * lo[0]),
        box.oy + (box.dy * lo[1])
      )
    }
  }

  return new bSVGElement({
    tag: "polyline",
    attributes: {
      class: "r30",
      points: points.toString(),
    },
  }).set();
}

function circle([baseWidth, baseHeight, width, height], c, size) {
  const w = new m (baseWidth, width);
  const h = new m (baseHeight, height);
  let slope = Math.min(h.ab / w.ab, w.ab / h.ab);

  return new bSVGElement({
    tag: 'circle',
    attributes: {
      class: "r30",
      cx: w.x(c[size][0]),
      cy: h.x(c[size][1]),
      r: Math.min(w.ab * (c[size][2]), h.ab * (c[size][2])) * slope,
    },
  }).set();
}

/*
//  HTML RENDERING
*/

// split text string into array
function decode(text) {
  let rawRads = text.split(/-/);
  let rads = [];

  // iterate over each encoded radical  
  for (const rad of rawRads) {
    let r = rad;
    // if possibly a compound rad (starts with a compound initial letter)
    // test if is a compound rad (contains follow up letter and digit)
    if ((/^[lapt][mp][\d]/).test(rad)) {
      // make array of each piece from the compound rad
      r = [rad[0]].concat(rad.match(/([mp][\d])/g));
    }

    rads.push(r);
  }

  return (rads)
}

// create svg shape from shape specified in r30.data
// shape is drawn into character using data stored in box object
function shapeSwitch(rad, box) {
  switch (rads[rad].shape) {
    case 'line':
      return line(
        box,
        rads[rad]
      )
    case 'polyline':
      return polyline(
        box,
        rads[rad]
      )
      /*
    case 'circle':
      return circle(
        box,
        rads[rad]
      )
        */
  }
}

// render multiple line pieces as a polyline correctly
function polyPocket(rad, box) {
  let shapes = [];
  // start with main radbit (a, l, etc.)
  let polyOrder = [[rads[rad[0]], 1, 0]];

  console.log(rad.filter((r) => r[1] == 2).length == (rad.length - 1))

  let soFar = '';
  for (const piece of rad) {
    soFar += piece;
    console.log('cool', soFar.match(/3/g) ? [0, 1, 0] : [1, 0])
    switch (piece[1]) {
      case '1':
        // push polyline points in correct order, 1 manner/place is pushed to end of polyline
        polyOrder.push(
          [rads[rad[0] + piece], 0, 1] // 0,1 order is not relevant here like it is in manner/place 3
        );
        break;
      case '2':
        // render m/p 2 as single line, not needed to be in polyline
        shapes.push(line(
          box,
          rads[rad[0] + piece],
          // shorten m/p 2 radbits if both are present and also the only two on main radbit
          rad.filter((r) => r[1] == 2).length == (rad.length - 1) && rad.length == 3 ? 'xy2' : 'xy'
        ));
        break;
      case '3':
        // push polyline points in correct order, 3 manner/place is unshifted to start at beginning of polyline
        polyOrder.unshift(
          [rads[rad[0] + piece], 0, 1]
          // if there is already a 3 manner/place rendered, render current m/p (the one being unshifted to come before) 
          // to retrun to starting postion to start polyline marker to draw next m/p in sequence
          // .concat(soFar.match(/3/g) ? [0, 1] : [1, 0])
        );
        break;
    }
  }

  shapes.push(polyline(box, ...polyOrder));

  return shapes;
}

class Box {
  constructor(dmsn) {
    this.w = dmsn.width;
    this.l = dmsn.length;
    this.m = dmsn.margin;
    // offset
    this.ox = this.m;
    this.oy = this.m;
    this.dx = this.w - (this.m * 2);
    this.dy = this.l - (this.m * 2);
  }

  resize(x1, y1, x2, y2) {
    // offset box by x1 & y1 ammount
    this.ox = this.m + (this.dx * x1);
    this.oy = this.m + (this.dy * y1);

    console.log((this.dx))

    // shorten dimensions of box by offset & by x2,y2
    this.dx -= (this.dx / (1 / x1)) + (this.dx * (1 - x2));
    this.dy -= (this.dy / (1 / y1)) + (this.dy * (1 - y2));

    /*
      this.m + (this.dx * x1) + (this.m / 2 * Math.ceil(x1)), 
      this.m + (this.dy * y1) + (this.m / 2 * Math.ceil(y1)), 
      (this.width - this.m) + (this.dx * (x2 - 1)) - (this.m / 2 * Math.ceil(Math.abs(x2 - 1))), 
      (this.length - this.m) + (this.dy * (y2 - 1)) - (this.m / 2 * Math.ceil(Math.abs(y2 - 1))),
    */
  }
}

// create character
function char(text, dmsn) {
  let shapes = [];
  let rads = decode(text);
  
  //let i = 0;
  for (const rad of rads) {
      let box = new Box(dmsn);
    /*if (rads.length > 1) {
      i += 1;
      switch (rads.length) {
        case 2:
          switch (i) {
            case 1: box = b.resize(0, 0, 0.5, 1); break;
            case 2: box = b.resize(0.5, 0, 1, 1); break;
          }
        case 3: {

        }
      }
    }*/
    // if multiple radicals

    console.log('rad:', rad)

    //box.resize(0, 0.5, 1, 1)
    
    if (Array.isArray(rad)) {
      shapes.push(...polyPocket(rad, box)) // ap1, lp3m1, etc.
    } else {
      shapes.push(shapeSwitch(rad, box)); // l, a, o, etc.
    }
  }

  return shapes;
}

// dimensions for svg
let dmsn = {
  length: 500,
  width: 500,
  margin: 40,
};

let svg = new bSVGElement({
  tag: 'svg',
  attributes: {
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: dmsn.width,
    height: dmsn.length,
  },
}).set();

svg.append(...char("n", dmsn));

// "s1-s2-s3-s4"
 
document.getElementById("con-r30").appendChild(svg);