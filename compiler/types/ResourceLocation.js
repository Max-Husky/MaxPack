/**
 * Represents a resource location in the format of "namespace:path".
 * The namespace can optionally start with a '#' to indicate that it is a reference.
 * The path must not start or end with a '/' and must not contain '..'.
 * @class
 * @immutable
 */
class ResourceLocation {
  #namespace;
  #path;
  #isRef;

  /**
   * Shows the resource location ID.
   * Will never include the '#' prefix, even if the resource location is a reference.
   * @type {string}
   */
  get id() {return this.#namespace + ':' + this.#path;}

  /**
   * Shows the resource location ID with a '#' prefix regardless of whether the resource location is a reference or not.
   * @type {string}
   */
  get refId() {return '#' + this.id;}

  /**
   * Shows the resource location ID with a '#' prefix if the resource location is a reference, or without a '#' prefix if it is not.
   * @type {string}
   */
  get trueId() {return (this.#isRef ? '#' : '') + this.id;}

  /**
   * Shows the namespace of the resource location.
   * @type {string}
   */
  get namespace() {return this.#namespace;}

  /**
   * Shows the path of the resource location.
   * @type {string}
   */
  get path() {return this.#path;}

  /**
   * Indicates whether the resource location is a reference (starts with '#').
   * @type {boolean}
   */
  get isRef() {return this.#isRef;}

  /**
   * Creates a new ResourceLocation instance.
   * @param {string} id - The resource location ID.
   */
  constructor(id) {
    if (!ResourceLocation.validateId(id)) {
      throw new RangeError(`Invalid resource location ID: ${id}`);
    }
    let arr = id.split(':');
    this.#isRef = arr[0].startsWith('#');
    this.#namespace = this.#isRef ? arr[0].slice(1) : arr[0];
    this.#path = arr[1];
  }

  /**
   * Validates a resource location ID.
   * @param {string} id - The resource location ID to validate.
   * @returns {boolean} True if the ID is valid, false otherwise.
   */
  static validateId(id) {
    let arr = id.split(':');
    if (arr.length !== 2) return false;
    let [namespace, path] = arr;
    if (!/^#?[a-z0-9_.-]*$/.test(namespace) || /^#?\.\.$/.test(namespace)) return false;
    if (!/^[a-z0-9_.-/]*$/.test(path) || path.startsWith('/') || path.endsWith('/') || path.includes('//') || path.includes('..')) return false;
    return true;
  }

  /**
   * Checks if this resource location is equal to another.
   * @param {string|ResourceLocation|{id: string}} other - The other resource location to compare to.
   * @returns {boolean} True if the resource locations are equal, false otherwise.
   */
  isEqual(other) {
    try {
      switch (typeof other) {
        case 'string':
          return this.id === (other.startsWith('#') ? other.slice(1) : other);
        case 'object':
          return this.id === (other.id.startsWith('#') ? other.id.slice(1) : other.id);
        default:
          return false;
      }
    } catch (err) {
      return false;
    }
  }

  /**
   * Returns the primitive value of the resource location, which is its ID without the '#' prefix.
   * @returns {string}
   */
  valueOf() {
    return this.id;
  }

  /**
   * The string representation of the resource location.
   * @returns {string}
   */
  toString() {
    return this.trueId;
  }

  /**
   * The JSON representation of the resource location.
   * @returns {string}
   */
  toJSON() {
    return this.trueId;
  }
}

module.exports = ResourceLocation;
