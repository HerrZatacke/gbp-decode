const transformToClassic = (data) => {
  const transformed = [];
  let currentLine = '';

  for (let i = 0; i < data.length; i += 1) {
    currentLine += ` ${data[i].toString(16)
      .padStart(2, '0')}`;

    if (i % 16 === 15) {
      transformed.push(currentLine.trim());
      currentLine = '';
    }
  }

  return transformed.join('\n');
};

module.exports = transformToClassic;
