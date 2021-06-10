const { COMMAND_INIT, COMMAND_PRINT, COMMAND_DATA, COMMAND_STATUS } = require('./constants');

const commandName = (c) => {
  switch (c) {
    case COMMAND_INIT:
      return 'INIT';
    case COMMAND_PRINT:
      return 'PRINT';
    case COMMAND_DATA:
      return 'DATA';
    case COMMAND_STATUS:
      return 'STATUS';
    default:
      return '-';
  }
}

const logPackets = (packets) => {
  console.log(packets);
  console.log(
    packets.map(({ command, data, hasCompression, dataLength }) => ({
      command: commandName(command),
      hasCompression: hasCompression ? 'yes' : 'no',
      dataLength,
      data: data.margins ? `marginUpper: ${data.marginUpper} - marginLower: ${data.marginLower}` : '...',
    }))
  );

  return packets;
}

module.exports = logPackets;
