import {parseReducedPackets} from './parseReducedPackets';
import {inflateTransferPackages} from './inflateTransferPackages';
import {getImageDataStream} from './getImageDataStream';
import {decompressDataStream} from './decompressDataStream';
import {decodePrintCommands} from './decodePrintCommands';
import {harmonizePalettes} from './harmonizePalettes';
import {transformToClassic} from './transformToClassic';
import {completeFrame} from './completeFrame';

export const parsePicoToClassic = (bytes: number[] | Uint8Array): string[][] => (
  completeFrame(
    transformToClassic(
      harmonizePalettes(
        decodePrintCommands(
          decompressDataStream(
            getImageDataStream(
              inflateTransferPackages(
                parseReducedPackets(bytes)
              )
            )
          )
        )
      )
    )
  )
)
