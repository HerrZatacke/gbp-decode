import fs from "node:fs/promises";
import path from "node:path";
import { hash } from 'ohash';

import toByteArray from "./toByteArray";
import parsePackets from "./parsePackets";
import getImageDataStream from "./getImageDataStream";
import decompressDataStream from "./decompressDataStream";
import decodePrintCommands from "./decodePrintCommands";
import harmonizePalettes from "./harmonizePalettes";
import transformToClassic from "./transformToClassic";
// import parseReducedPackets from "./parseReducedPackets";
// import inflateTransferPackages from "./inflateTransferPackages";
// import completeFrame from "./completeFrame";
import {ParsedPacket, PrintPacket} from "./Types";
import logPackets from "./logPackets";

const run = async () => {
  const fileName = 'white.txt';
  const filePath = path.join(process.cwd(), fileName)

  let fileContents: string;
  let rawPackets: number[];
  let parsedPackets: ParsedPacket[];
  let dataPackets: ParsedPacket[];
  let decompPackets: ParsedPacket[];
  let printInfoPackets: (ParsedPacket | PrintPacket)[];
  let harmonizedPackets: (PrintPacket | ParsedPacket)[];
  let classicPrintStreamImages: string[][];

  try {
    fileContents = await fs.readFile(filePath, { encoding: 'utf8' });
  } catch (error) {
    console.error((error as Error).message);
    process.exit(-1);
  }

  rawPackets = await toByteArray(fileContents);
  parsedPackets = await parsePackets(rawPackets);
  fs.writeFile('debug_ts.txt', JSON.stringify(parsedPackets, null, 2), {encoding: 'utf8'});
  dataPackets = await getImageDataStream(parsedPackets);
  // console.log({ dataPackets: dataPackets.length });
  decompPackets = await decompressDataStream(dataPackets);
  // console.log({ decompPackets: decompPackets.length });
  printInfoPackets = await decodePrintCommands(decompPackets);
  // console.log({ printInfoPackets: printInfoPackets.length });
  harmonizedPackets = await harmonizePalettes(printInfoPackets);
  // console.log({ harmonizedPackets: harmonizedPackets.length });
  classicPrintStreamImages = await transformToClassic(harmonizedPackets);
  // console.log({ classicPrintStreamImages: classicPrintStreamImages.length });

  try {
    await Promise.all(classicPrintStreamImages.map(async (image: string[], index: number) => {
      image.unshift('!{"command":"INIT"}');
      await fs.writeFile(path.join(process.cwd(), `out_${index}.txt`), image.join('\n'), {encoding: 'utf8'});
    }));
  } catch (error) {
    console.error(error);
  }

  // const picoFileName = 'pico.txt';
  // const picoFilePath = path.join(process.cwd(), picoFileName)
  //
  // try {
  //   fileContents = await fs.readFile(picoFilePath, {encoding: 'utf8'})
  // } catch (error) {
  //   console.error((error as Error).message);
  //   process.exit(-1);
  // }
  //
  // packets = await toByteArray(fileContents);
  //
  //   .then(parseReducedPackets)
  //   .then(inflateTransferPackages)
  //   .then(getImageDataStream)
  //   .then(decompressDataStream)
  //   .then(decodePrintCommands)
  //   .then(harmonizePalettes)
  //   .then(transformToClassic)
  //   .then(completeFrame)
  //   .then((images) => {
  //     images.forEach((image, index) => {
  //       image.unshift('!{"command":"INIT"}');
  //       fs.writeFileSync(path.join(process.cwd(), `out_pico_${index}.txt`), image.join('\n'), {encoding: 'utf8'});
  //     });
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  //
}

run();
