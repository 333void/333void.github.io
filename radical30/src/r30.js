import { bElement, bSVGElement } from "../../utils/bNodes.js";
import { chars } from "./r30.data.js"

/*
//  DATA 2 SVG ELEMENT
*/

// measurement
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

function line([baseWidth, baseHeight, width, height], c, size) {
  const w = new m (baseWidth, width);
  const h = new m (baseHeight, height);
  let dx = 0; 
  let dy = 0;

  /*
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



    

    /*
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
  */

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

  return new bSVGElement({
    tag: 'line',
    attributes: {
      class: "r30",
      x1: w.x(c[size][0][0]),
      y1: h.x(c[size][0][1]),
      x2: w.x(c[size][1][0]) + dx,
      y2: h.x(c[size][1][1]) + dy,
    },
  }).set();
}

function polyline([baseWidth, baseHeight, width, height], ...Cs) {
  const w = new m (baseWidth, width);
  const h = new m (baseHeight, height);

  let points = [];

  for (const c of Cs) {
    for (let i = 1; i < c.length; i++) {
      points.push(
        w.x(c[0][c[i]][0]),
        h.x(c[0][c[i]][1]),
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

function decode(text) {
  let rawRads = text.split(/-/);
  let rads = [];

  // iterate over each encoded radical  
  for (const rad of rawRads) {
    // if possibly a compound rad (starts with a compound initial letter)
    if (/^[lapt]/.test(rad)) {
      // test if is a compound rad (contains follow up letter and digit)
      if ((/[mp][\d]/).test(rad)) {
        // make array of each piece from the compound rad
        let arr = rad.match(/([mp][\d])/g)
        arr.unshift(rad[0])
        rads.push(arr);
        continue
      }
    }

    rads.push(rad);
  }

  //console.log(rads)
  return rads
}

function charSwitch(rad, box, size) {
  switch (chars[rad].shape) {
    case 'line':
      return line(
        box,
        chars[rad],
        size
      )
    case 'circle':
      return circle(
        box,
        chars[rad],
        size
      )
  }
}

// render multiple line pieces as a polyline correctly
function polyPocket(rad, box) {
  let shapes = [];
  let one = [];
  let two = [];
  let three = [];

  for (const piece of rad) {
    switch (piece[1]) {
      case '2':
        two.push(piece);
        shapes.push(line(
          box,
          chars[rad[0] + piece],
          // if diagonal has to be re-sloped
          rad[0] == 'a' || rad[0] == 'p' ? true : false
        ));
        break;
      case '1':
        one.push(piece)
        break;
      case '3':
        three.push(piece)
        break;
    }
  }

  let Cs = [[chars[rad[0]], 2, 1]];

  // push polyline points in correct order
  switch (three.length) {
    case (2):
      Cs.unshift([chars[rad[0] + three[1]], 1, 2, 1]);
    case (1):
      Cs.unshift([chars[rad[0] + three[0]], 2, 1]);
  }

  switch (one.length) {
    case (2): {
      Cs.push([chars[rad[0] + one[1]], 1, 2, 1]);
    }
    case (1):
      Cs.push([chars[rad[0] + one[0]], 1, 2]);
  }

  if (Cs.length > 1) {
    shapes.push(polyline(box, ...Cs));
  } else {
    // draw the compound base piece (l/a/p/t) (m/p piece pushed in switch)
    shapes.push(charSwitch(rad[0], box));
  }

  return shapes;
}

class Box {
  constructor(dmsn) {
    this.w = dmsn.w;
    this.l = dmsn.l;
    this.x1 = dmsn.margin;
    this.y1 = dmsn.margin;
    this.x2 = dmsn.w - dmsn.margin;
    this.y2 = dmsn.l - dmsn.margin;
    this.x = this.x2 - this.x1;
    this.y = this.y2 - this.y1;
  }

  resize(bX1, bY1, bX2, bY2) {
    return [
      this.x1 + (this.x * bX1) + (this.x1 / 2 * Math.ceil(bX1)), 
      this.y1 + (this.y * bY1) + (this.y1 / 2 * Math.ceil(bY1)), 
      this.x2 + (this.x * (bX2 - 1)) - (this.x1 / 2 * Math.ceil(Math.abs(bX2 - 1))), 
      this.y2 + (this.y * (bY2 - 1)) - (this.y1 / 2 * Math.ceil(Math.abs(bY2 - 1))),
    ];
  }

  get box() {
    return [this.x1, this.y1, this.x2, this.y2];
  }
}

function char(text, dmsn) {
  let rads = decode(text);
  let shapes = [];
  let b = new Box(dmsn);
  let size = 'big';
  
  let i = 0;
  for (const rad of rads) {
    let box = b.box;
    if (rads.length > 1) {
      i += 1;
      size = 'small'
      switch (rads.length) {
        case 2:
          switch (i) {
            case 1: box = b.resize(0, 0, 0.5, 1); break;
            case 2: box = b.resize(0.5, 0, 1, 1); break;
          }
        case 3: {

        }
      }
    }

    if (Array.isArray(rad)) {
      shapes.push(...polyPocket(rad, box))
    } else {
      shapes.push(charSwitch(rad, box, size));
    }    
  }

  return shapes;
}

// length/width, margin
let dmsn = {
  l: 500,
  w: 500,
  margin: 40,
};

let svg = new bSVGElement({
  tag: 'svg',
  attributes: {
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: dmsn.w,
    height: dmsn.l,
  },
}).set();

svg.append(...char("l", dmsn));
 
document.getElementById("con-r30").appendChild(svg);