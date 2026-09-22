const ResourceLocation = require('./ResourceLocation.js');

/**
 * A tag item represents a single item within a tag
 * @class
 * @immutable
 */
class TagItem extends ResourceLocation {
  #type;
  #required;

  /**
   * Shows the type of the tag item.
   * @type {string}
   * @readonly
   */
  get type() {return this.#type;}

  /**
   * Indicates whether the tag item is required.
   * @type {boolean}
   * @readonly
   */
  get required() {return this.#required;}

  /**
   * Creates a new TagItem instance.
   * @param {string} id The resource location ID of the tag item.
   * @param {string} type The type of the tag item.
   * @param {boolean} required Indicates whether the tag item is required.
   */
  constructor(id, type, required = false) {
    if (!TagItem.validateType(type)) throw new RangeError(`Invalid tag type: ${type}`);
    super(id);
    this.#type = type;
    this.#required = required;
  }

  /**
   * Creates a TagItem from an object.
   * @description This method is used to create a TagItem instance from an object that has an ID and an optional required flag.
   * @param {TagItemLike|ResourceLocation} obj 
   * @param {string} type The type of the tag item.
   * @returns {TagItem}
   */
  static fromObject(obj, type) {
    return new TagItem((obj.trueId ||obj.id), type, obj.required ?? false);
  }

  /**
   * Creates a TagItem from a value.
   * @param {string|TagItemLike|ResourceLocation} value 
   * @param {string} type The type of the tag item.
   * @returns {TagItem}
   */
  static fromValue(value, type) {
    switch (typeof value) {
      case 'string':
        return new TagItem(value, type);
      case 'object':
        if (value instanceof TagItem && value.type === type) return value;
        return TagItem.fromObject(value, type);
      default:
        throw new TypeError(`Invalid tag item value: ${value}`);
    }
  }

  /**
   * Validates a tag type.
   * @param {string} type The type to validate.
   * @returns {boolean} True if the type is valid, false otherwise.
   */
  static validateType(type) {
    return /^[a-z0-9_.-]+$/.test(type);
  }

  /**
   * A primitive value representation of the tag item.
   * @description This method returns the primitive value of the tag item, which is its ID.
   * @returns {string} The primitive value of the tag item.
   */
  valueOf() {
    return this.id;
  }

  /**
   * A JSON representation of the tag item.
   * @description This method returns a JSON representation of the tag item, which includes its true ID and whether it is required.
   * @returns {{id: string, required: boolean}}
   */
  toJSON() {
    return {
      id: this.trueId,
      required: this.required
    };
  }

  /**
   * Returns a string representation of the tag item.
   * @returns {string} A string representation of the tag item.
   */
  toString() {
    return `${this.trueId}`
  }
}

module.exports = TagItem;

/**
 * @typedef {Object} TagItemLike
 * @property {string} id
 * @property {boolean} [required]
 */
