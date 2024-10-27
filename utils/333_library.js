// HTML ELEMENT GENERATORS

export class bElement {
  constructor(data) {
    this.data = data;
    this.element = document.createElement(data.tag);
  }

  // add attributes to element
  fab() {
    for (const atti in this.data.attributes) {
      this.element.setAttribute(atti, this.data.attributes[atti]);
    }
    if (this.data.innerHTML) {
      this.element.innerHTML = this.data.innerHTML
    }
    return this.element;
  }
}

export class bSVGElement extends bElement {
  constructor(data) {
    super(data);
    this.element = document.createElementNS("http://www.w3.org/2000/svg", data.tag);
  }
}