const fs = require('fs');
const path = require('path');

const Tag = require('./tag.js');
const root = require('./root.js');

/**
 * Loads all tags from the maxpack datapack.
 * @returns {Promise<Map<string, Tag>>}
 */
async function loadTags() {
  console.log('maxpack loading tags...');
  let p = path.join(root, 'maxpack', 'tags');
  let files = await fs.promises.readdir(p, { withFileTypes: true, recursive: true });
  let proms = [];

  for (let file of files) {
    if (file.isFile() && file.name.endsWith('.json')) {
      let type = file.parentPath.slice(p.length + 1, file.parentPath.indexOf(path.sep, p.length + 1));
      let name = file.parentPath.slice(file.parentPath.indexOf(path.sep, p.length + 1) + 1) + '/' + file.name.slice(0, -5).replaceAll(path.sep, '/');

      proms.push(Tag.openFile(name, 'maxpack', type));
    }
  }

  let map = new Map();
  for (let i of await Promise.all(proms)) {
    map.set(i.id, i);
  }
  console.log('maxpack tags loaded');
  return map;
}

/**
 * Creates a reverse map of the tags.
 */
async function loadResources() {
  console.log('loading maxpack resources...');
  let tags = loadTags();

  let resources = {
    tags: await tags,
  }

  console.log('maxpack resources loaded');
  return resources;
}

var maxpackResources = loadResources();

module.exports = loadResources();
