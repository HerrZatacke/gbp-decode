const fourtyLines = (new Array(40)).fill('00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00');

const completeFrame = (images: string[][]): string[][] => (
  images.map((image: string[]): string[] => {
    if (image.length !== 280) {
      return image;
    }

    return [
      ...fourtyLines,
      ...image,
      ...fourtyLines,
    ];
  })
);

export default completeFrame;
