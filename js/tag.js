const root = require('./root.js');
const fs = require('fs');
const path = require('path');

class Tag {
  name = '';
  namespace = '';
  /**@type {Array<string|{id: string, required: boolean}>} */
  contents = [];
  type = '';
  replace = false;
  savable = true;

  get id() {return this.namespace + ':' + this.name;}
  get savePath() {return path.join(root, this.namespace, 'tags', this.type, this.name + '.json');}

  constructor(name, namespace, type, {contents = [], replace = false, savable = true} = {}) {
    this.name = name;
    this.namespace = namespace;
    this.type = type;
    this.contents = contents;
    this.replace = replace;
    this.savable = savable;
  }

  /**
   * Saves the tag to a file.
   * @returns {Promise<void>}
   */
  save() {
    if (!this.savable) return Promise.resolve();
    return fs.promises.mkdir(path.dirname(this.savePath), {recursive: true})
      .then(() => fs.promises.writeFile(this.savePath, JSON.stringify({replace: this.replace, values: this.contents})));
  }

  /**
   * Opens a tag file and creates a new Tag instance.
   * @param {string} name The name of the tag (without namespace)
   * @param {string} namespace The namespace of the tag
   * @param {string} type The type of the tag
   * @returns {Promise<Tag>} A promise that resolves to a new Tag instance.
   */
  static openFile(name, namespace, type) {
    let p = path.join(root, namespace, 'tags', type, name + '.json');
    return fs.promises.readFile(p, 'utf8')
    .then(JSON.parse)
    .catch(err => {
      if (err.code === 'ENOENT') {
        return {replace: false, values: []};
      }
    })
    .then(data => new Tag(name, namespace, type, {contents: data.values, replace: data.replace}));
  }

  /**
   * Creates a new Tag instance from a dumpy file.
   * @param {string} filePath The path to the dumpy file.
   * @returns {Promise<Tag[]>} A promise that resolves to an array of new Tag instances.
   */
  static fromDumpy(filePath) {
    return fs.promises.readFile(filePath, 'utf8')
    .then(JSON.parse)
    .then(data => data.map(tagData => new Tag(tagData.path, tagData.namespace, tagData.tag_type, {contents: tagData.contents, replace: false, savable: false})))
    .catch(err => {
      console.error('Error reading dumpy tags file:', err);
      return [];
    });
  }
}

module.exports = Tag;
