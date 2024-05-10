import {ParsedPacket} from "./Types";

const { COMMAND_DATA } = require("./constants");
import unpack from "./unpack";

const decompressDataStream = (packets: ParsedPacket[]): ParsedPacket[] => {
  return packets
    .map((packet: ParsedPacket): ParsedPacket => {
      if (packet.command === COMMAND_DATA) {
        return {
          ... packet,
          hasCompression: 0,
          data: packet.hasCompression ? unpack(packet.data) : packet.data
        } as ParsedPacket;
      }

      return packet;
    });
}

export default decompressDataStream;
