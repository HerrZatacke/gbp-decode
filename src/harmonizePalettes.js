const { COMMAND_PRINT, COMMAND_DATA } = require('./constants');

const harmonizePalette = (charA, charB, paletteDefinition = [3, 2, 1, 0]) => {

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


const harmonizePalettes = (packets) => {

  const unharmonizedPackets = [];

  return packets
    .map((packet) => {
      switch (packet.command) {
        case COMMAND_DATA:
          unharmonizedPackets.push(packet);
          break;

        case COMMAND_PRINT:
          while (unharmonizedPackets.length) {
            let unharmonizedPacket = unharmonizedPackets.shift();
            const data = [];

            for (let i = 0; i < unharmonizedPacket.data.length; i += 2) {
              data.push(
                ...harmonizePalette(
                  unharmonizedPacket.data[i],
                  unharmonizedPacket.data[i + 1],
                  packet.data.paletteData,
                ),
              );
            }

            Object.assign(unharmonizedPacket, { data });
          }
          break;

      }

      return packet;
    })
};

module.exports = harmonizePalettes;
