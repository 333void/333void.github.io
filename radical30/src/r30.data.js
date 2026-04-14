export const rads = {
  // m = manner, p = place

  // radicals are coded [x,y] 0 to 1

  // a place/manner radical bit (ex. the p1 of ap1) off a main bit (ex. the a of ap1) is coded with the first [x,y] starting on the main bit

  /*
  //  COMPOUNDS
  */

  /*
  //  LABIAL
  */

  l: {
    shape: 'line',
    aspect: 'horizontal',
    xy: [
      [0, 0.5], 
      [1, 0.5]
    ]
  },
  lm1: {
    shape: 'line',
    xy: [
      [0, 0.5], 
      [0, 1]
    ]
  },
  lm2: {
    shape: 'line',
    xy: [
      [0.5, 0.5], 
      [0.5, 1]
    ],
    xy2: [
      [0.5, 0.5], 
      [0.5, 0.75]
    ]
  },
  lm3: {
    shape: 'line',
    xy: [
      [1, 0.5], 
      [1, 1]
    ]
  },
  lp1: {
    shape: 'line',
    xy: [
      [0, 0.5], 
      [0, 0]
    ]
  },
  lp2: {
    shape: 'line',
    xy: [
      [0.5, 0.5], 
      [0.5, 0]
    ],
    xy2: [
      [0.5, 0.5], 
      [0.5, 0.25]      
    ]
  },
  lp3: {
    shape: 'line',
    xy: [
      [1, 0.5], 
      [1, 0]
    ]
  },

  /*
  //  ALVEOLAR
  */

  a: {
    shape: 'line',
    aspect: 'vertical',
    xy: [
      [0, 1], 
      [1, 0]
    ]
  },
  ap1: {
    shape: 'line',
    xy: [
      [0, 1], 
      [0, 0.5]
    ]
  },
  ap2: {
    shape: 'line',
    xy: [
      [0.5, 0.5], 
      [0, 0]
    ],
    xy2: [
      [0.5, 0.5], 
      [0.25, 0.25]
    ]
  },
  ap3: {
    shape: 'line',
    xy: [
      [1, 0], 
      [0.5, 0]
    ]
  },
  am1: {
    shape: 'line',
    xy: [
      [0, 1], 
      [0.5, 1]
    ]
  },
  am2: {
    shape: 'line',
    xy: [
      [0.5, 0.5], 
      [1, 1]
    ],
    xy2: [
      [0.5, 0.5], 
      [0.75, 0.75]
    ]
  },
  am3: {
    shape: 'line',
    xy: [
      [1, 0], 
      [1, 0.5]
    ]
  },
  // palatal
  p: [
    'line',
    [0, 0],
    [1, 1]
  ],
  // throat
  t: [
    'line',
    [0.5, 0],
    [0.5, 1]
  ],

  /*
  //  ARTICULATION
  */
  o: {
    shape: 'circle',
    data: [0.5, 0.5, 0.45],
  },
  n: {
    shape: 'polyline',
    points: [
      [0, 0.5],
      [0, 0],
      [1, 0],
      [1, 0.5],
      [0, 0.5],
      [0, 1],
      [1, 1],
      [1, 0.5]
    ],
  },
}