import fs from "fs";
import path from "path";
import toByteArray from "./toByteArray";
import parsePackets from "./parsePackets";
import parseReducedPackets from "./parseReducedPackets";
import inflateTransferPackages from "./inflateTransferPackages";
import getImageDataStream from "./getImageDataStream";
import decompressDataStream from "./decompressDataStream";
import decodePrintCommands from "./decodePrintCommands";
import harmonizePalettes from "./harmonizePalettes";
import transformToClassic from "./transformToClassic";
import completeFrame from "./completeFrame";



const fileName = 'white.txt';
const filePath = path.join(process.cwd(), fileName)

fs.readFile(filePath, { encoding: 'utf8' }, (error, fileContents) => {
  if (error) {
    console.error(error.message);
    process.exit(-1);
  }

  toByteArray(fileContents)
    .then(parsePackets)
    .then(getImageDataStream)
    .then(decompressDataStream)
    .then(decodePrintCommands)
    .then(harmonizePalettes)
    .then(transformToClassic)
    .then((images) => {
      images.forEach((image, index) => {
        image.unshift('!{"command":"INIT"}');
        fs.writeFileSync(path.join(process.cwd(), `out_${index}.txt`), image.join('\n'), {encoding: 'utf8'});
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

const picoFileName = 'pico.txt';
const picoFilePath = path.join(process.cwd(), picoFileName)

fs.readFile(picoFilePath, { encoding: 'utf8' }, (error, fileContents) => {
  if (error) {
    console.error(error.message);
    process.exit(-1);
  }

  toByteArray(fileContents)
    .then(parseReducedPackets)
    .then(inflateTransferPackages)
    .then(getImageDataStream)
    .then(decompressDataStream)
    .then(decodePrintCommands)
    .then(harmonizePalettes)
    .then(transformToClassic)
    .then(completeFrame)
    .then((images) => {
      images.forEach((image, index) => {
        image.unshift('!{"command":"INIT"}');
        fs.writeFileSync(path.join(process.cwd(), `out_pico_${index}.txt`), image.join('\n'), {encoding: 'utf8'});
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

