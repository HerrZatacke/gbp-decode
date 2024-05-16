import {ParsedPacket, PrintPacket, TransformedImage} from "./Types";
import {COMMAND} from "./constants";

export const transformToClassic = (packets: (PrintPacket | ParsedPacket)[]): string[][] => {

  let image: TransformedImage = {
    transformed: [],
  };

  let currentLine: string[] = [];
  const images: string[][] = [];

  packets.forEach((packet: (PrintPacket | ParsedPacket)) => {
    switch (packet.command) {
      case COMMAND.DATA:
        for (let i = 0; i < packet.data.length; i += 1) {
          currentLine.push(packet.data[i].toString(16).padStart(2, '0'));
          if (i % 16 === 15) {
            image.transformed.push(currentLine.join(' '));
            currentLine = [];
          }
        }
        break;

      case COMMAND.PRINT:

        image.palette = (packet as PrintPacket).data.paletteData || image.palette;

        if ((packet as PrintPacket).data.marginLower !== 0) {
          images.push(image.transformed);

          image = {
            transformed: [],
          };
          currentLine = [];
        }


        break;

      default:
        break;
    }
  });

  if (image.transformed.length) {
    images.push(image.transformed);
  }

  return images;
};
