const fs = require('fs');
const cp = require('child_process');

const PATH_TO_7ZIP_INSTALL = 'C:\\Program Files\\7-Zip';

const PATH_TO_MODS_DIR = '../mods';

const WORKING_DIR = '../working';
const OUTPUT_DIR = '../output';

/**
 * Extracts mods to the given directory using 7zip.
 * @param {string} dir The mod directory to find the mods to extract.
 * @param {string} outputDir The directory to output the extracted mods.
 */
async function extractMods(dir, outputDir) {
  let files = fs.promises.readdir(dir, { withFileTypes: true, recursive: false });
  let promsises = [];

  // extract every found mod to the output directory.
  for (let file of await files) {
    if (file.isFile()) {
      if (file.name.endsWith('.jar')) {
        promsises.push(
          new Promise(
            (res, rej) => cp.exec(`"${PATH_TO_7ZIP_INSTALL}\\7z.exe" x "${file.parentPath}\\${file.name}" -o"${outputDir}\\${file.name}"`, (err) => {
              if (err) rej(err);
              else res();
            })
          )
        );
      }
    }
  }

  // wait for all the extractions to finish.
  await Promise.all(promsises);
}
