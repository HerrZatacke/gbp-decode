import { ParsedPacket } from "./Types";
import {COMMAND} from "./constants";

export const getImageDataStream = (packets: ParsedPacket[]): ParsedPacket[] => {
  return packets.filter(({ command }: ParsedPacket) => (
    command === COMMAND.DATA ||
    command === COMMAND.PRINT
  ));
}
