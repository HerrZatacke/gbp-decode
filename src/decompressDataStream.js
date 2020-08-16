const unpack = require('./unpack');
const { COMMAND_DATA } = require("./constants");

const decompressDataStream = (packets) => {
  return packets
    .map((packet) => {
      if (packet.command === COMMAND_DATA) {
        return {
          ... packet,
          data: packet.hasCompression ? unpack(packet.data) : packet.data
        };
      }

      return packet;
    });
}

module.exports = decompressDataStream;
