import {COMMAND, STATE} from "./constants";
import {Packet, ParsedPacket} from "./Types";

export const parseReducedPackets = (bytes: number[] | Uint8Array): ParsedPacket[] => {
  let state = STATE.AWAIT_COMMAND;

  let packet: Packet = {
    command: null,
    buffer: [],
    data: [],
    hasCompression: 0,
    dataLength: 0,
  };

  const packets: ParsedPacket[] = [];

  const nextPacket = () => {
    // Push current packet into return list
    packets.push({
      command: packet.command,
      data: packet.data,
      dataLength: packet.dataLength,
      hasCompression: packet.hasCompression,
    });

    packet = {
      command: null,
      buffer: [],
      data: [],
      hasCompression: 0,
      dataLength: 0,
    };
    state = STATE.AWAIT_COMMAND;
  };

  bytes.forEach((byte, index) => {
    switch (state) {

      case STATE.AWAIT_COMMAND:
        packet.command = byte;

        switch (packet.command) {
          case COMMAND.INIT:
            nextPacket();
            return;

          case COMMAND.DATA:
            state = STATE.AWAIT_COMPRESSION_INFO;
            return;

          case COMMAND.PRINT:
            state = STATE.AWAIT_PACKET_DATA_LENGTH;
            return;

          case COMMAND.TRANSFER:
            state = STATE.AWAIT_PACKET_DATA_LENGTH;
            return;

          default:
            throw new Error(`Unknown packet command: 0x${packet.command.toString(16)} at index ${index}`);
        }

      case STATE.AWAIT_COMPRESSION_INFO:
        packet.hasCompression = byte;
        state = STATE.AWAIT_PACKET_DATA_LENGTH;
        return;

      case STATE.AWAIT_PACKET_DATA_LENGTH:
        if (packet.buffer.length === 0) {
          packet.buffer.push(byte);
          return;
        }

        // eslint-disable-next-line no-bitwise
        packet.dataLength = packet.buffer[0] + (byte << 8);

        packet.buffer = [];

        if (packet.dataLength === 0) {
          state = STATE.AWAIT_COMMAND;
          nextPacket();
          return;
        }

        state = STATE.AWAIT_DATA;
        return;

      case STATE.AWAIT_DATA:
        packet.buffer.push(byte);

        if (packet.buffer.length === packet.dataLength) {
          packet.data = packet.buffer;
          state = STATE.AWAIT_COMMAND;

          // In the reduced picoprinter dumps, there is
          // no "PRINT" command after a "TRANSFER" command
          // this will add a synthentic one
          if (packet.command === COMMAND.TRANSFER) {
            nextPacket(); // Current packet has been pushed,

            // New current "fake" packet is created
            // The buffer[] will not be pushed to the
            // list in the next "nextPacket()" call
            packet = {
              buffer: [],
              command: COMMAND.PRINT,
              data: [1, 3, 228, 127],
              hasCompression: 0,
              dataLength: 4,
            };
          }

          nextPacket();
        }

        break;
      default:
    }
  });

  return packets;
};
