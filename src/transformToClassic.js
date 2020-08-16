const { COMMAND_DATA, COMMAND_PRINT } = require('./constants');

const transformToClassic = (packets) => {

  let transformed = [];
  let currentLine = '';
  const images = [];

  packets.forEach((packet) => {

    switch (packet.command) {
      case COMMAND_DATA:
        for (let i = 0; i < packet.data.length; i += 1) {
          currentLine += ` ${packet.data[i].toString(16)
            .padStart(2, '0')}`;

          if (i % 16 === 15) {
            transformed.push(currentLine.trim());
            currentLine = '';
          }
        }
        break;

      case COMMAND_PRINT:

        if (packet.data.marginLower !== 0) {
          images.push({
            transformed: transformed.join('\n'),
            palette: packet.data.paletteData,
          });

          transformed = [];
          currentLine = '';
        }


        break;

      default:
        break;
    }
  });

  return images;
};

module.exports = transformToClassic;
