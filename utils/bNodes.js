// HTML ELEMENT GENERATORS

export class bNode {
  constructor(data) {
    this.data = data;
    this.node = '';
  }

  // add attributes to node
  set() {
    // standard in-bracket attributes
    for (const att in this.data.attributes) {
      this.node.setAttribute(att, this.data.attributes[att]);
    }
    // specialty attributes
    for (const att of ['innerHTML', 'textContent']) {
      if (this.data[att]) {
        this.node[att] = this.data[att];
      }
    }
    return this.node;
  }
}

export class bElement extends bNode {
  constructor(data) {
    super(data);
    this.node = document.createElement(data.tag);
  }
}

export class bSVGElement extends bNode {
  constructor(data) {
    super(data);
    this.node = document.createElementNS("http://www.w3.org/2000/svg", data.tag);
  }
}