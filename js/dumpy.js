const Tag = require('./tag.js');

/**
 * Loads the dumpy tags and creates a reverse map of them.
 * @returns {Promise<Map<string, string[]>>} A promise that resolves to an object containing the tags and their reverse map.
 */
async function loadTags() {
  let dumpyTags = await Tag.fromDumpy('./dumps/tags.json');
  let dumpyTagMap = new Map();
  for (let t of dumpyTags) {
    for (let item of t.contents) {
      if (!dumpyTagMap.has(item)) {
        dumpyTagMap.set(item, []);
      }
      dumpyTagMap.get(item).push(t.id);
    }
  }
  
  return dumpyTagMap;
}

async function loadDumpy() {
  let tags = loadTags();

  return {
    tags: await tags,
  }
}

module.exports = loadDumpy();
