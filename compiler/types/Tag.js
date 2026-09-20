const fs = require('fs');
const path = require('path');
const HeapJs = require('heap-js');

const ResourceLocation = require('./ResourceLocation.js');
const TagItem = require('./TagItem.js');

class Tag extends ResourceLocation {
  /**@type {string} */
  #type;
  /**
   * The item values being stored in the tag.
   * @type {HeapJs.Heap<TagItem>}
   */
  #values;
  /**@type {boolean} */
  #replace;

  /**
   * Shows the type of the tag.
   * @type {string}
   * @readonly
   */
  get type() {return this.#type;}

  /**
   * Indicates whether the tag is a replacement tag.
   * @type {boolean}
   * @readonly
   */
  get replace() {return this.#replace;}
  set replace(value) {
    if (typeof value !== 'boolean') throw new TypeError(`Invalid replace value: ${value}`);
    this.#replace = value;
  }

  /**
   * Returns an iterator for the tag values.
   * @type {Iterable<TagItem>}
   * @readonly
   */
  get values() {return this[Symbol.iterator]();}

  /**
   * Returns an iterator for the tag values.
   * @returns {Iterable<TagItem>} An iterator for the tag values.
   * @readonly
   */
  get [Symbol.iterator]() {return this.#values.iterator();}

  /**
   * Creates a new tag.
   * @param {string} id The ID of the tag.
   * @param {string} type The type of the tag.
   * @param {Array<import('./TagItem.js').TagItemLike|ResourceLocation|TagItem|string>} values The values of the tag.
   * @param {boolean} replace Whether the tag is a replacement tag.
   */
  constructor(id, type, values = [], replace = false) {
    if (!TagItem.validateType(type)) throw new RangeError(`Invalid tag type: ${type}`);
    if (typeof replace !== 'boolean') throw new TypeError(`Invalid replace value: ${replace}`);
    super(id);
    this.#type = type;
    this.#replace = replace;
    this.#values = new HeapJs.Heap();

    for (let value of values) {
      this.addValue(value);
    }
  }

  /**
   * Checks if the tag has a specific value.
   * @param {string|TagItemLike|ResourceLocation|TagItem} value The value to check.
   * @returns {boolean} True if the tag has the value, false otherwise.
   */
  hasValue(value) {
    if (!(value instanceof TagItem)) value = TagItem.fromValue(value, this.#type);
    return this.#values.contains(value);
  }

  /**
   * Adds a value to the tag.
   * @param {string|TagItemLike|ResourceLocation} value The value to add.
   * @throws {Error} If the value is not a valid tag item or resource location.
   */ 
  addValue(value) {
    let item = TagItem.fromValue(value, this.#type);
    if (this.hasValue(item)) return;
    this.#values.add(item);
  }

  /**
   * Removes a value from the tag.
   * @param {string|TagItemLike|ResourceLocation} value The value to remove.
   * @returns {boolean} True if the value was removed, false if it was not found.
   */
  removeValue(value) {
    let ind = this.#values.findIndex(v => v.isEqual(value));
    if (ind !== -1) {
      this.#values.splice(ind, 1);
      return true;
    }
    return false;
  }

  /**
   * Loads a tag from a file.
   * If the file does not exist, it will be created with an empty values, and the replace flag set to false.
   * @async
   * @param {string} packPath The path to the root of the datapack the resource is to be loaded from
   * @param {string} id The resource id.
   * @param {string} type The type of tag it is.
   * @returns {Promise<TagData>} A promise that resolves to a TagData instance.
   * @throws {Error} If the file cannot be parsed.
   */
  static loadFromFile(packPath, id, type) {
    let resloc = new ResourceLocation(id);
    let data = fs.promises.readFile(path.join(packPath, 'data', resloc.namespace, type, resloc.path + '.json'), 'utf8')
        .then(JSON.parse)
        .catch(err => err.code === 'ENOENT' ? {replace: false, values: []} : Promise.reject(err))
        .then(d => new TagData(id, type, d.values ?? [], d.replace ?? false));
    return data;
  }
}

module.exports = Tag;
