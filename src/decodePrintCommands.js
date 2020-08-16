const { COMMAND_PRINT } = require("./constants");

/*
 The palette table is one-byte data, consisting of four two-bit values.
 The highest two bits in a palette byte represent the brightness of dots with index 0.
 The next two bits represent those of index 1, the next, index 2, and the lowest two bits, index 3.
 */
const paletteData = (paletteRaw) => {
  return [
    (paletteRaw >> 6) & 0x3,
    (paletteRaw >> 4) & 0x3,
    (paletteRaw >> 2) & 0x3,
    (paletteRaw >> 0) & 0x3,
  ];
};

const decodePrintCommands = (packets) => {
  return packets
    .map((packet) => {
      if (packet.command === COMMAND_PRINT) {
        return {
          ...packet,
          data: {
            margins: packet.data[1],
            marginUpper: packet.data[1] >> 4,
            marginLower: packet.data[1] & 0xf,
            palette: packet.data[2],
            paletteData: paletteData(packet.data[2]),
          }
        }
      }

      return packet;
    })
};

module.exports = decodePrintCommands;
