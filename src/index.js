const loadBytes = require('./loadBytes');
const parsePackets = require('./parsePackets');
const getImageDataStream = require('./getImageDataStream');
const decompressDataStream = require('./decompressDataStream');
const transformToClassic = require('./transformToClassic');

loadBytes('test.txt')
  .then(parsePackets)
  .then(getImageDataStream)
  .then(decompressDataStream)
  .then(transformToClassic)
  .then((output) => {
    console.log(output);
  })
  .catch((error) => {
    console.error(error);
  });
