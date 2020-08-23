
const toByteArray = (fileContents) => {
  return Promise.resolve(
    fileContents
      .split('\n')
      .map(line => line.trim())
      .map(line => line
        .split(' ')
        .filter(Boolean)
        .map((cc) => parseInt(cc, 16))
      )
      .flat()
  )
};

module.exports = toByteArray;
