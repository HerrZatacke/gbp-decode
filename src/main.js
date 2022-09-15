const parsePackets = require('./parsePackets');
const parseReducedPackets = require('./parseReducedPackets');
const getImageDataStream = require('./getImageDataStream');
const decompressDataStream = require('./decompressDataStream');
const decodePrintCommands = require('./decodePrintCommands');
const harmonizePalettes = require('./harmonizePalettes');
const transformToClassic = require('./transformToClassic');

const unpack = require('./unpack');
const parsePaletteByte = require('./parsePaletteByte');
const harmonizePalette = require('./harmonizePalette');

module.exports = {
  parsePackets,
  parseReducedPackets,
  getImageDataStream,
  decompressDataStream,
  decodePrintCommands,
  harmonizePalettes,
  transformToClassic,

  unpack,
  parsePaletteByte,
  harmonizePalette,
};
