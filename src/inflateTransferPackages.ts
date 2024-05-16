import {COMMAND} from "./constants";
import {ParsedPacket} from "./Types";


const twoTiles: number[] = (new Array(2 * 16)).fill(0x00);

const inflate = (arr: number[]): number[] => {
  const chunks = [];
  let i = 0;
  const n = arr.length;

  while (i < n) {
    chunks.push(...twoTiles, ...arr.slice(i, i += 256), ...twoTiles);
  }

  return chunks;
};

export const inflateTransferPackages = (packets: ParsedPacket[]): ParsedPacket[] => (
  packets.map((packet): ParsedPacket => {
    if (packet.command !== COMMAND.TRANSFER) {
      return packet;
    }

    return {
      ...packet,
      command: COMMAND.DATA,
      data: inflate(packet.data),
    };
  })
);
