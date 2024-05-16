import {COMMAND} from "./constants";
import {parsePaletteByte} from "./parsePaletteByte";
import {ParsedPacket, PrintData, PrintPacket} from "./Types";

export const decodePrintCommands = (packets: ParsedPacket[]): (PrintPacket | ParsedPacket)[] => {
  return packets
    .map((packet) => {
      if (packet.command === COMMAND.PRINT) {
        const printData: PrintData = {
          margins: packet.data[1],
          marginUpper: packet.data[1] >> 4,
          marginLower: packet.data[1] & 0xf,
          palette: packet.data[2],
          paletteData: parsePaletteByte(packet.data[2]),
        }

        return {
          ...packet,
          data: printData,
        } as PrintPacket;
      }

      return packet;
    })
};
