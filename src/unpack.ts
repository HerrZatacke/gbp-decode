import {DECOMP_MODE} from "./constants";

const unpack = (data: number[]): number[] => {
  const dataOut: number[] = [];

  let mode = DECOMP_MODE.DETECT_LENGTH;
  let length = 0;

  data.forEach((byte) => {
    switch (mode) {
      case DECOMP_MODE.DETECT_LENGTH:
        // noinspection JSBitwiseOperatorUsage
        if (byte & 0x80) {
          mode = DECOMP_MODE.COMPRESSED;
          length = (byte & 0x7f) + 2;
        } else {
          mode = DECOMP_MODE.UNCOMPRESSED;
          length = byte + 1;
        }
        return;

      case DECOMP_MODE.UNCOMPRESSED:
        length -= 1;
        if (length === 0) {
          mode = DECOMP_MODE.DETECT_LENGTH;
        }
        dataOut.push(byte);
        return;

      case DECOMP_MODE.COMPRESSED:
        dataOut.push(...[...Array(length)].map(() => byte))
        mode = DECOMP_MODE.DETECT_LENGTH;
        length = 0;
        return;

    }
  });

  return dataOut;

};

export default unpack;
