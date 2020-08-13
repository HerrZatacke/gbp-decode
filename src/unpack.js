const MODE_DETECT_LENGTH = 0;
const MODE_COMPRESSED = 1;
const MODE_UNCOMPRESSED = 2;

const unpack = (data) => {
  const dataOut = [];

  let mode = MODE_DETECT_LENGTH;
  let length = 0;

  data.forEach((byte) => {
    switch (mode) {
      case MODE_DETECT_LENGTH:
        // noinspection JSBitwiseOperatorUsage
        if (byte & 0x80) {
          mode = MODE_COMPRESSED;
          length = (byte & 0x7f) + 2;
        } else {
          mode = MODE_UNCOMPRESSED;
          length = byte + 1;
        }
        return;

      case MODE_UNCOMPRESSED:
        length -= 1;
        if (length === 0) {
          mode = MODE_DETECT_LENGTH;
        }
        dataOut.push(byte);
        return;

      case MODE_COMPRESSED:
        dataOut.push(...[...Array(length)].map(() => byte))
        mode = MODE_DETECT_LENGTH;
        length = 0;
        return;

    }
  });

  return dataOut;

};

module.exports = unpack;
