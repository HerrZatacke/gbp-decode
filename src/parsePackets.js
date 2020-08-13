const {
  EMPTY_PACKET,
  STATE_AWAIT_MAGIC_BYTES,
  STATE_AWAIT_COMMAND,
  STATE_AWAIT_COMPRESSION_INFO,
  STATE_AWAIT_PACKET_DATA_LENGTH,
  STATE_AWAIT_DATA,
  STATE_AWAIT_CHECKSUM,
  STATE_AWAIT_KEEPALIVE,
  STATE_AWAIT_STATUS_QUERY,
} = require('./constants');

const parsePackets = (bytes) => {

  return new Promise((resolve) => {

    let state = STATE_AWAIT_MAGIC_BYTES;
    let packet = {...EMPTY_PACKET};
    const packets = [];

    bytes.forEach((byte) => {
      switch (state) {
        case STATE_AWAIT_MAGIC_BYTES:
          if (packet.buffer.length === 0 && byte === 0x88) {
            packet.buffer.push(byte);
            return;
          } else if (packet.buffer.length === 1 && byte === 0x33) {
            packet.buffer = [];
            state = STATE_AWAIT_COMMAND;
            return;
          } else {
            packet = {...EMPTY_PACKET};
            return;
          }

        case STATE_AWAIT_COMMAND:
          packet.command = byte;
          state = STATE_AWAIT_COMPRESSION_INFO;
          return;

        case STATE_AWAIT_COMPRESSION_INFO:
          packet.hasCompression = byte;
          state = STATE_AWAIT_PACKET_DATA_LENGTH;
          return;

        case STATE_AWAIT_PACKET_DATA_LENGTH:
          if (packet.buffer.length === 0) {
            packet.buffer.push(byte);
            return;
          }

          packet.dataLength = packet.buffer[0] + (byte << 8);
          packet.buffer = [];

          if (packet.dataLength === 0) {
            state = STATE_AWAIT_CHECKSUM;
          } else {
            state = STATE_AWAIT_DATA;
          }
          return;

        case STATE_AWAIT_DATA:
          if (packet.buffer.length < packet.dataLength) {
            packet.buffer.push(byte);
            return;
          }
          packet.data = packet.buffer;
          packet.buffer = [];
          state = STATE_AWAIT_CHECKSUM;
          return;


        case STATE_AWAIT_CHECKSUM:
          if (packet.buffer.length === 0) {
            packet.buffer.push(byte);
            return;
          }
          packet.checksum = packet.buffer[0] + (byte << 8);
          packet.buffer = [];
          state = STATE_AWAIT_KEEPALIVE;
          return;

        case STATE_AWAIT_KEEPALIVE:
          state = STATE_AWAIT_STATUS_QUERY;
          return;

        case STATE_AWAIT_STATUS_QUERY:
          state = STATE_AWAIT_MAGIC_BYTES;
          delete packet.buffer;
          packets.push(packet);
          packet = {...EMPTY_PACKET};
          return;

      }
    });

    resolve(packets);
  });

}

module.exports = parsePackets;
