const fs = require('fs');
const path = require('path');

const loadBytes = require('./loadBytes');
const parsePackets = require('./parsePackets');
const getImageDataStream = require('./getImageDataStream');
const decompressDataStream = require('./decompressDataStream');
const decodePrintCommands = require('./decodePrintCommands');
const harmonizePalettes = require('./harmonizePalettes');
const transformToClassic = require('./transformToClassic');

loadBytes('all.txt')
  .then(parsePackets)
  .then(getImageDataStream)
  .then(decompressDataStream)
  .then(decodePrintCommands)
  .then(harmonizePalettes)
  .then(transformToClassic)
  .then((files) => {
    files.forEach((file, index) => {
      file.transformed.unshift('!{"command":"INIT"}');
      fs.writeFileSync(path.join(process.cwd(), `out_${index}.txt`), file.transformed.join('\n'), { encoding: 'utf8' });
    });
  })
  .catch((error) => {
    console.error(error);
  });
