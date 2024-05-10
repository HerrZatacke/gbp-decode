const {
  STATE_AWAIT_COMMAND,
  STATE_AWAIT_COMPRESSION_INFO,
  STATE_AWAIT_PACKET_DATA_LENGTH,
  STATE_AWAIT_DATA,
  COMMAND_INIT,
  COMMAND_PRINT,
  COMMAND_DATA,
  COMMAND_TRANSFER,
} = require('./constants');

const parseReducedPackets = (bytes) => {
  let state = STATE_AWAIT_COMMAND;

  let packet = {
    command: null,
    buffer: [],
    data: [],
    hasCompression: null,
    dataLength: 0,
  };

  const packets = [];

  const nextPacket = () => {
    delete packet.buffer;
    packets.push(packet);
    packet = {
      command: null,
      buffer: [],
      data: [],
      hasCompression: null,
      dataLength: 0,
    };
    state = STATE_AWAIT_COMMAND;
  };

  return new Promise((resolve) => {

    bytes.forEach((byte, index) => {
      switch (state) {

        case STATE_AWAIT_COMMAND:
          packet.command = byte;

          switch (packet.command) {
            case COMMAND_INIT:
              nextPacket();
              return;

            case COMMAND_DATA:
              state = STATE_AWAIT_COMPRESSION_INFO;
              return;

            case COMMAND_PRINT:
              state = STATE_AWAIT_PACKET_DATA_LENGTH;
              return;

            case COMMAND_TRANSFER:
              state = STATE_AWAIT_PACKET_DATA_LENGTH;
              return;

            default:
              throw new Error(`Unknown packet command: 0x${packet.command.toString(16)} at index ${index}`);
          }

        case STATE_AWAIT_COMPRESSION_INFO:
          packet.hasCompression = byte;
          state = STATE_AWAIT_PACKET_DATA_LENGTH;
          return;

        case STATE_AWAIT_PACKET_DATA_LENGTH:
          if (packet.buffer.length === 0) {
            packet.buffer.push(byte);
            return;
          }

          // eslint-disable-next-line no-bitwise
          packet.dataLength = packet.buffer[0] + (byte << 8);

          packet.buffer = [];

          if (packet.dataLength === 0) {
            state = STATE_AWAIT_COMMAND;
            nextPacket();
            return;
          }

          state = STATE_AWAIT_DATA;
          return;

        case STATE_AWAIT_DATA:
          packet.buffer.push(byte);

          if (packet.buffer.length === packet.dataLength) {
            packet.data = packet.buffer;
            state = STATE_AWAIT_COMMAND;

            // There is no "PRINT" command after a "TRANSFER" command
            // this will add a synthentic one
            if (packet.command === 0x10) {
              nextPacket();
              packet = {
                command: 2,
                data: [1, 3, 228, 127],
                hasCompression: null,
                dataLength: 4,
              };
            }

            nextPacket();
          }

          break;
        default:
      }
    });

    resolve(packets);
  });
};

module.exports = parseReducedPackets;
