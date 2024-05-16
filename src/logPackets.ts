import {COMMAND} from "./constants";
import {ParsedPacket, PrintData, PrintPacket} from "./Types";


const commandName = (command: COMMAND | null): string => {
  switch (command) {
    case COMMAND.INIT:
      return 'INIT';
    case COMMAND.PRINT:
      return 'PRINT';
    case COMMAND.DATA:
      return 'DATA';
    case COMMAND.STATUS:
      return 'STATUS';
    default:
      return '-';
  }
}

interface LogPacket {
  command: string,
  hasCompression: string,
  dataLength: number,
  data: string,
}

export const logPackets = (packets: ParsedPacket[]) => {
  console.log(
    packets.map(({ command, data, hasCompression, dataLength }: ParsedPacket | PrintPacket): LogPacket => ({
      command: commandName(command),
      hasCompression: hasCompression ? 'yes' : 'no',
      dataLength,
      data: (data as PrintData).margins ? `marginUpper: ${(data as PrintData).marginUpper} - marginLower: ${(data as PrintData).marginLower}` : (data as number[]).slice(0, 20).join(','),
    }))
  );

  return packets;
}
