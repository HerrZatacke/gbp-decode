import {ParsedPacket} from "./Types";
import {COMMAND} from "./constants";
import {unpack} from "./unpack";

export const decompressDataStream = (packets: ParsedPacket[]): ParsedPacket[] => {
  return packets
    .map((packet: ParsedPacket): ParsedPacket => {
      if (packet.command === COMMAND.DATA) {
        return {
          ... packet,
          hasCompression: 0,
          data: packet.hasCompression ? unpack(packet.data) : packet.data
        } as ParsedPacket;
      }

      return packet;
    });
}
