
const toByteArray = (fileContents: string): number[] => (
  fileContents
    .split('\n')
    .filter((line) => !line.startsWith('//'))
    .map(line => line.trim())
    .map(line => line
      .split(' ')
      .filter(Boolean)
      .map((cc) => parseInt(cc, 16))
    )
    .flat()
);

export default toByteArray;
