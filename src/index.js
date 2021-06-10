const fs = require('fs');
const path = require('path');

const toByteArray = require('./toByteArray');
const parsePackets = require('./parsePackets');
const getImageDataStream = require('./getImageDataStream');
const decompressDataStream = require('./decompressDataStream');
const decodePrintCommands = require('./decodePrintCommands');
const harmonizePalettes = require('./harmonizePalettes');
const transformToClassic = require('./transformToClassic');

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

