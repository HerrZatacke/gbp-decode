import {COMMAND} from "./constants";

export type PaletteData = [number, number, number, number];
export type HarmonisedPalette = [number, number];

export interface PrintData {
  margins: number,
  marginUpper: number,
  marginLower: number,
  palette: number,
  paletteData: PaletteData,
}

export interface Packet {
  command: null | COMMAND,
  buffer: number[],
  data: number[] | Uint8Array,
  hasCompression: number,
  dataLength: number,
  checksum?: number,
}

export type ParsedPacket = Omit<Packet, 'buffer'>;

export interface PrintPacket extends Omit<Packet, 'data'> {
  command: COMMAND.PRINT,
  data: PrintData
}

export interface TransformedImage {
  transformed: string[],
  palette?: PaletteData,
}
