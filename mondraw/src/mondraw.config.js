const config = {
  elementIds:         ["myCanvas"],
  rows:               15,
  columns:            15,
  colors:             ["white",   "red",    "blue",   "yellow",		"black",  "lightgray" ],
  colorProbability:   [3, 				1, 				1, 				1,					0,        1,          ], // works as a ratio, it's relative to the total of all the items in the array
  maxRectWidth:       4, // max # of columns
  maxRectHeight:      4, // max # of rows
  strokeSize:         4, // px
}