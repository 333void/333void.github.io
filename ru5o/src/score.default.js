// the codified ru5o text becomes an object based on the musicXML 4.0 standard.
// this will make it easier to turn into an musicXML file after processing.
// this is of root type <score-partwise> bcuz ru5o is sectioned by parts when in multiline plaintext
export var score = {
  partList: [
    {
      scorePart: {
        id: 'P1',
        partName: 'Instrument',
        partAbbreviation: 'Ins.',
      },
    },
  ],
  parts: [
    {
      id: 'P1',
      measures: [
        {
          number: 1,
          attributes: {
            key: {
              fifths: 0,
              mode: 'major',
            },
            time: {
              beats: 4,
              beatType: 4,
            },
            divisions: 32,
          },
          notes: [
          ],
        },
      ],
    },
  ],
};