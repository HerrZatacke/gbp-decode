// const {
//   COMMAND_DATA,
//   COMMAND_TRANSFER,
// } = require('./constants');
//
// const twoTiles = (new Array(2 * 16)).fill(0);
//
// const inflate = (arr) => {
//   const chunks = [];
//   let i = 0;
//   const n = arr.length;
//
//   while (i < n) {
//     chunks.push(...twoTiles, ...arr.slice(i, i += 256), ...twoTiles);
//   }
//
//   return chunks;
// };
//
// const inflateTransferPackages = (packets) => (
//   packets.map((packet) => {
//     if (packet.command !== COMMAND_TRANSFER) {
//       return packet;
//     }
//
//     return {
//       ...packet,
//       command: COMMAND_DATA,
//       data: inflate(packet.data),
//     };
//   })
// );
//
//
// module.exports = inflateTransferPackages;
