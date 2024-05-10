import {Packet} from "./Types";

export enum COMMAND {
  INIT = 0x1,
  PRINT = 0x2,
  DATA = 0x4,
  STATUS = 0xf,
  TRANSFER = 0x10,
}

export enum STATE {
  AWAIT_MAGIC_BYTES = 0,
  AWAIT_COMMAND = 1,
  AWAIT_COMPRESSION_INFO = 2,
  AWAIT_PACKET_DATA_LENGTH = 3,
  AWAIT_DATA = 4,
  AWAIT_CHECKSUM = 5,
  AWAIT_KEEPALIVE = 6,
  AWAIT_STATUS_QUERY = 7,
}

export const EMPTY_PACKET: Packet = {
  command: null,
  buffer: [],
  data: [],
  hasCompression: null,
  dataLength: 0,
  checksum: 0,
};

export enum DECOMP_MODE {
  DETECT_LENGTH = 0,
  COMPRESSED = 1,
  UNCOMPRESSED = 2,
}
