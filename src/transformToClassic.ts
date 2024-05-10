const { COMMAND_DATA, COMMAND_PRINT } = require('./constants');

const transformToClassic = (packets) => {

  let image = {
    transformed: [],
    palette: null,
  };

  let currentLine = [];
  const images = [];

  packets.forEach((packet) => {
    switch (packet.command) {
      case COMMAND_DATA:
        for (let i = 0; i < packet.data.length; i += 1) {
          currentLine.push(packet.data[i].toString(16).padStart(2, '0'));
          if (i % 16 === 15) {
            image.transformed.push(currentLine.join(' '));
            currentLine = [];
          }
        }
        break;

      case COMMAND_PRINT:

        image.palette = packet.data.paletteData || image.palette;

        if (packet.data.marginLower !== 0) {
          images.push(image.transformed);

          image = {
            transformed: [],
          };
          currentLine = [];
        }


        break;

      default:
        break;
    }
  });

  if (image.transformed.length) {
    images.push(image.transformed);
  }

  return images;
};

module.exports = transformToClassic;
