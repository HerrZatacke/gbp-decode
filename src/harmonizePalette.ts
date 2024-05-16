import {HarmonisedPalette, PaletteData} from "./Types";

export const harmonizePalette = (charA: number, charB: number, paletteDefinition: PaletteData = [3, 2, 1, 0]): HarmonisedPalette => {

  const bits =  [...Array(8)].map((_, index) => ({
    a: (charB >> 7 - index) % 2,
    b: (charA >> 7 - index) % 2,
  }))

  const res = bits
    .map(({ a, b, }) => ((a << 1) + b))
    // .map(plg)
    .map((val) => (paletteDefinition[3 - val]))
    // .map(plg)
    .map((mapped) => ({
      a: (mapped >> 1) % 2,
      b: mapped % 2,
    }))
    .reduce((acc, current, index) => (
      {
        a: acc.a + (current.a << 7-index),
        b: acc.b + (current.b << 7-index),
      }
    ), {
      a: 0,
      b: 0,
    })

  return [
    res.b & 0xff,
    res.a & 0xff,
  ];
}
