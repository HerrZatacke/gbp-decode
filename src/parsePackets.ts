import { STATE, EMPTY_PACKET } from "./constants";
const parsePackets = (bytes: number[]) => {

  return new Promise((resolve) => {

    let state = STATE.AWAIT_MAGIC_BYTES;
    let packet = {...EMPTY_PACKET};
    const packets = [];

    bytes.forEach((byte) => {
      switch (state) {
        case STATE.AWAIT_MAGIC_BYTES:
          if (packet.buffer.length === 0 && byte === 0x88) {
            packet.buffer.push(byte);
            return;
          } else if (packet.buffer.length === 1 && byte === 0x33) {
            packet.buffer = [];
            state = STATE.AWAIT_COMMAND;
            return;
          } else {
            packet = {...EMPTY_PACKET};
            return;
          }

        case STATE.AWAIT_COMMAND:
          packet.command = byte;
          state = STATE.AWAIT_COMPRESSION_INFO;
          return;

        case STATE.AWAIT_COMPRESSION_INFO:
          packet.hasCompression = byte;
          state = STATE.AWAIT_PACKET_DATA_LENGTH;
          return;

        case STATE.AWAIT_PACKET_DATA_LENGTH:
          if (packet.buffer.length === 0) {
            packet.buffer.push(byte);
            return;
          }

          packet.dataLength = packet.buffer[0] + (byte << 8);
          packet.buffer = [];

          if (packet.dataLength === 0) {
            state = STATE.AWAIT_CHECKSUM;
          } else {
            state = STATE.AWAIT_DATA;
          }
          return;

        case STATE.AWAIT_DATA:
          if (packet.buffer.length < packet.dataLength) {
            packet.buffer.push(byte);
            return;
          }
          packet.data = packet.buffer;
          packet.buffer = [];
          state = STATE.AWAIT_CHECKSUM;
          return;


        case STATE.AWAIT_CHECKSUM:
          if (packet.buffer.length === 0) {
            packet.buffer.push(byte);
            return;
          }
          packet.checksum = packet.buffer[0] + (byte << 8);
          packet.buffer = [];
          state = STATE.AWAIT_KEEPALIVE;
          return;

        case STATE.AWAIT_KEEPALIVE:
          state = STATE.AWAIT_STATUS_QUERY;
          return;

        case STATE.AWAIT_STATUS_QUERY:
          state = STATE.AWAIT_MAGIC_BYTES;
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
