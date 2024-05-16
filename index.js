import fs from "node:fs/promises";
import path from "node:path";
import crypto from "crypto";
import {
  toByteArray,
  parsePicoToClassic,
  parseDefaultToClassic,
} from "./dist/main.cjs";

const hash = (value) => crypto.createHash('md5').update(value).digest('hex');

const expect = {
  'out_alice_0.txt':  '5bcd243a4d2decb9e16199a9a5d65550',
  'out_comp_0.txt':  'f894863c029d80d5a596f179dce80e9d',
  'out_gradient_0.txt':  '90a63d908c2d025060392e7bae18c607',
  'out_uncomp_0.txt':  'd6c2470398331fd23e18f196db53cd80',
  'out_all_0.txt':  '5bcd243a4d2decb9e16199a9a5d65550',
  'out_all_1.txt':  'f894863c029d80d5a596f179dce80e9d',
  'out_all_2.txt':  '90a63d908c2d025060392e7bae18c607',
  'out_all_3.txt':  'd6c2470398331fd23e18f196db53cd80',
  'out_white_0.txt':  '71d26ff43ab5d5f6819f91bfcd624d47',
  'out_pico_0.txt':  'd9c6e1b219223c7316ac120bf1625b77',
  'out_pico_1.txt':  '307528d17e7375336872613335d28dd6',
  'out_pico_2.txt':  'cd3cc5935d31ed9f04dc0fd8eb663123',
  'out_pico_3.txt':  'be14f4aa8c58b282cc6dd383ba57475b',
  'out_pico_4.txt':  'bdf9c9aa923bdafd6a410c4e8de541da',
  'out_pico_5.txt':  '72b236e17edddf3f8a81b565401afc3f',
}

const outDir = path.join(process.cwd(), 'out');

const writeImages = async (images, outKey) => {
  try {
    await Promise.all(images.map(async (image, index) => {
      image.unshift('!{"command":"INIT"}');
      const fileName = `out_${outKey}_${index}.txt`;
      const fileContent = image.join('\n');
      const fileHash = hash(fileContent);

      if (expect[fileName] === fileHash) {
        await fs.writeFile(path.join(outDir, `out_${outKey}_${index}.txt`), image.join('\n'), {encoding: 'utf8'});
      } else {
        console.error(`\n  ${fileName} does not match expected hash value.\n`);
      }
    }));
  } catch (error) {
    console.error(error);
  }
}

const runStandard = async (fileName, outKey) => {
  const filePath = path.join(process.cwd(), 'in', fileName);
  console.log(`parsing ${filePath}`);

  let fileContents;

  try {
    fileContents = await fs.readFile(filePath, { encoding: 'utf8' });
  } catch (error) {
    console.error(error.message);
    process.exit(-1);
  }

  const classicPrintStreamImages = parseDefaultToClassic(toByteArray(fileContents));

  await writeImages(classicPrintStreamImages, outKey);
}

const runReduced = async (fileName, outKey) => {
  const filePath = path.join(process.cwd(), 'in', fileName);
  console.log(`parsing ${filePath}`);

  let fileContents;

  try {
    fileContents = await fs.readFile(filePath, {encoding: 'utf8'})
  } catch (error) {
    console.error(error.message);
    process.exit(-1);
  }

  const classicPrintStreamImages = parsePicoToClassic(toByteArray(fileContents));

  await writeImages(classicPrintStreamImages, outKey);
}

fs.mkdir(outDir, {
  recursive: true,
}).then(async () => {
  await runStandard('alice.txt', 'alice');
  await runStandard('all.txt', 'all');
  await runStandard('comp.txt', 'comp');
  await runStandard('gradient.txt', 'gradient');
  await runStandard('uncomp.txt', 'uncomp');
  await runStandard('white.txt', 'white');

  await runReduced('pico.txt', 'pico');
});

