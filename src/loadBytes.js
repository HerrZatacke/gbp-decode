const fs = require('fs');
const path = require('path');

const loadBytes = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(process.cwd(), fileName), { encoding: 'utf8' }, (error, fileContents) => {

      if (error) {
        reject(error);
        return;
      }

      resolve(
        fileContents
          .split('\n')
          .map(line => line.trim())
          .map(line => line
            .split(' ')
            .filter(Boolean)
            .map((cc) => parseInt(cc, 16))
          )
          .flat(),
      );
    });
  });
};

module.exports = loadBytes;
