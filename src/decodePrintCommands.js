const { COMMAND_PRINT } = require("./constants");

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
          }
        }
      }

      return packet;
    })
};

module.exports = decodePrintCommands;
