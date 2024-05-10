const { COMMAND_PRINT,  COMMAND_DATA } = require('./constants');

const getImageDataStream = (packets) => {
  return packets.filter(({ command }) => (
    command === COMMAND_DATA ||
    command === COMMAND_PRINT
  ));
}

module.exports = getImageDataStream;
