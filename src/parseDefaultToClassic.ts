import {parsePackets} from "./parsePackets";
import {getImageDataStream} from "./getImageDataStream";
import {decompressDataStream} from "./decompressDataStream";
import {decodePrintCommands} from "./decodePrintCommands";
import {harmonizePalettes} from "./harmonizePalettes";
import {transformToClassic} from "./transformToClassic";

export const parseDefaultToClassic = (bytes: number[] | Uint8Array): string[][] => (
  transformToClassic(
    harmonizePalettes(
      decodePrintCommands(
        decompressDataStream(
          getImageDataStream(
            parsePackets(bytes)
          )
        )
      )
    )
  )
);
