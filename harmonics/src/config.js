const harmonics = 20; // # of harmonics rendered
const octavesDisplayed = 3;
const svg = document.getElementById("canvas");

const graphPadding = 40;
const graphWidth = (svg.getAttribute('width') - (graphPadding * 2));
const graphHeight = svg.getAttribute('height') - (graphPadding * 2);
const graphRowHeight = 50;
const graphWidthUnit = graphWidth / (Math.pow(2, octavesDisplayed) - 1); // decreases exponentially (minus one because of series being {1, 3, 7, 15})

const dotRadius = 10; 

export const cfg = {
  harmonics, svg, octavesDisplayed,
  graphPadding, graphWidth, graphHeight, graphRowHeight, graphWidthUnit,
  dotRadius,
}; 