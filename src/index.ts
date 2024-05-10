import fs from "node:fs/promises";
import path from "node:path";
import {ParsedPacket, PrintPacket} from "./Types";
// Common functions
import toByteArray from "./toByteArray";
import parsePackets from "./parsePackets";
import getImageDataStream from "./getImageDataStream";
import decompressDataStream from "./decompressDataStream";
import decodePrintCommands from "./decodePrintCommands";
import harmonizePalettes from "./harmonizePalettes";
import transformToClassic from "./transformToClassic";
// PicoPrinter extras
import parseReducedPackets from "./parseReducedPackets";
import inflateTransferPackages from "./inflateTransferPackages";
import completeFrame from "./completeFrame";

const runStandard = async (fileName: string, outKey: string) => {
  const filePath = path.join(process.cwd(), 'in', fileName);

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
  dataPackets = await getImageDataStream(parsedPackets);
  decompPackets = await decompressDataStream(dataPackets);
  // fs.writeFile('debug_ts.txt', JSON.stringify(decompPackets, null, 2), {encoding: 'utf8'});
  printInfoPackets = await decodePrintCommands(decompPackets);
  harmonizedPackets = await harmonizePalettes(printInfoPackets);
  classicPrintStreamImages = await transformToClassic(harmonizedPackets);

  try {
    await Promise.all(classicPrintStreamImages.map(async (image: string[], index: number) => {
      image.unshift('!{"command":"INIT"}');
      await fs.writeFile(path.join(process.cwd(), 'out', `out_${outKey}_${index}.txt`), image.join('\n'), {encoding: 'utf8'});
    }));
  } catch (error) {
    console.error(error);
  }
}

const runReduced = async (fileName: string, outKey: string) => {
  const filePath = path.join(process.cwd(), 'in', fileName);

  let fileContents: string;
  let reducedPackages: number[];
  let rawPackets: ParsedPacket[];
  let parsedPackets: ParsedPacket[];
  let dataPackets: ParsedPacket[];
  let decompPackets: ParsedPacket[];
  let printInfoPackets: (ParsedPacket | PrintPacket)[];
  let harmonizedPackets: (PrintPacket | ParsedPacket)[];
  let reducedClassicPrintStreamImages: string[][];
  let classicPrintStreamImages: string[][];

  try {
    fileContents = await fs.readFile(filePath, {encoding: 'utf8'})
  } catch (error) {
    console.error((error as Error).message);
    process.exit(-1);
  }

  reducedPackages = await toByteArray(fileContents);
  rawPackets = await parseReducedPackets(reducedPackages);
  parsedPackets = await inflateTransferPackages(rawPackets); // Reduced Packets are missing the frame. This adds the sides
  dataPackets = await getImageDataStream(parsedPackets);
  decompPackets = await decompressDataStream(dataPackets);
  // fs.writeFile('debug_ts.txt', JSON.stringify(decompPackets, null, 2), {encoding: 'utf8'});
  printInfoPackets = await decodePrintCommands(decompPackets);
  harmonizedPackets = await harmonizePalettes(printInfoPackets);
  reducedClassicPrintStreamImages = await transformToClassic(harmonizedPackets);
  classicPrintStreamImages = await completeFrame(reducedClassicPrintStreamImages);  // Reduced Packets are missing the frame. This adds top and bottom of the frame

  try {
    await Promise.all(classicPrintStreamImages.map(async (image: string[], index: number) => {
      image.unshift('!{"command":"INIT"}');
      await fs.writeFile(path.join(process.cwd(), 'out', `out_${outKey}_${index}.txt`), image.join('\n'), {encoding: 'utf8'});
    }));
  } catch (error) {
    console.error(error);
  }

}

runStandard('alice.txt', 'alice');
runStandard('all.txt', 'all');
runStandard('comp.txt', 'comp');
runStandard('gradient.txt', 'gradient');
runStandard('uncomp.txt', 'uncomp');
runStandard('white.txt', 'white');

runReduced('pico.txt', 'pico');
