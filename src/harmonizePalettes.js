const { COMMAND_PRINT, COMMAND_DATA } = require('./constants');
const harmonizePalette = require('./harmonizePalette');

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
