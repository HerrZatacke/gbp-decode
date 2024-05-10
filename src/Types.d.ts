import {COMMAND} from "./constants";

export interface Packet {
  command: COMMAND,
  buffer: number[],
  data: [],
  hasCompression: boolean,
  dataLength: number,
  checksum: number,
}
