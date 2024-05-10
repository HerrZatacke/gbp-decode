const parsePackets = require('./parsePackets');
const parseReducedPackets = require('./parseReducedPackets');
const inflateTransferPackages = require('./inflateTransferPackages')
const getImageDataStream = require('./getImageDataStream');
const decompressDataStream = require('./decompressDataStream');
const decodePrintCommands = require('./decodePrintCommands');
const harmonizePalettes = require('./harmonizePalettes');
const transformToClassic = require('./transformToClassic');

const unpack = require('./unpack');
const parsePaletteByte = require('./parsePaletteByte');
const harmonizePalette = require('./harmonizePalette');
const completeFrame = require('./completeFrame');
const logPackets = require('./logPackets');

module.exports = {
  parsePackets,
  parseReducedPackets,
  inflateTransferPackages,
  getImageDataStream,
  decompressDataStream,
  decodePrintCommands,
  harmonizePalettes,
  transformToClassic,
  unpack,
  parsePaletteByte,
  harmonizePalette,
  completeFrame,
  logPackets,
};
