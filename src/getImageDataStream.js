const { COMMAND_DATA } = require('./constants');

const getImageDataStream = (packets) => {
  return packets.filter(({ command }) => command === COMMAND_DATA);
}

module.exports = getImageDataStream;
