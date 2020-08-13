const unpack = require('./unpack');

const decompressDataStream = (dataPackets) => {
  return dataPackets
    .map(({ hasCompression, data }) => {
      if (hasCompression) {
        return unpack(data);
      } else {
        return data;
      }
    })
    .flat();
}

module.exports = decompressDataStream;
