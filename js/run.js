const dumpyResource = require('./dumpy.js');
const maxpackResource = require('./maxpack.js');
const Tag = require('./tag.js');

async function replicatedItems() {
  console.log('Replicating items...');
  let dumpy = await dumpyResource;
  let maxpack = await maxpackResource;
  let count = 0;

  for (let tag of maxpack.tags.values()) {
    for (let item of tag.contents) {
      let i = typeof item === 'string' ? item : item.id;
      if (dumpy.tags.has(i)) {
        for (let dumpyTag of dumpy.tags.get(i)) {
          if (dumpyTag.startsWith('maxpack:replicated')) continue;
          if (!maxpack.tags.has(dumpyTag))
            maxpack.tags.set(dumpyTag, await Tag.openFile(...dumpyTag.split(':').reverse(), 'item'))
          let ntag = maxpack.tags.get(dumpyTag);
          if (!ntag.contents.includes('#' + tag.id)) {
            ntag.contents.push('#' + tag.id);
            count++;
          }
        }
      }
    }
  }

  console.log('Replication complete');
  console.log(`Replicated ${count} item entries`)
}

async function saveResources() {
  console.log('Saving maxpack resources...');
  let maxpack = await maxpackResource;
  let proms = [];
  for (let tag of maxpack.tags.values()) {
    proms.push(tag.save());
  }
  await Promise.all(proms);
  console.log('Maxpack resources saved');
}

async function main() {
  await replicatedItems();
  await saveResources();
}

main();