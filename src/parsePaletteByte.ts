/*
The palette table is one-byte data, consisting of four two-bit values.
The highest two bits in a palette byte represent the brightness of dots with index 0.
The next two bits represent those of index 1, the next, index 2, and the lowest two bits, index 3.
*/
import {PaletteData} from "./Types";

const parsePaletteByte = (paletteRaw: number): PaletteData => {
  return [
    (paletteRaw >> 6) & 0x3,
    (paletteRaw >> 4) & 0x3,
    (paletteRaw >> 2) & 0x3,
    (paletteRaw >> 0) & 0x3,
  ];
};

export default parsePaletteByte;
