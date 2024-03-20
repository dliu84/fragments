// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// a2:
var md = require('markdown-it')();
//const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (
      (ownerId &&
        type &&
        Fragment.isSupportedType(type) &&
        typeof size === 'number' &&
        size >= 0) ||
      /;\s*charset=/.test(type)
    ) {
      this.id = id || randomUUID();
      this.ownerId = ownerId;
      this.created = created || new Date();
      this.updated = updated || new Date();
      this.type = type;
      size ? (this.size = size) : (this.size = 0);
    } else {
      if (!ownerId) {
        throw new Error(`Fragment missing ownerId not found!`);
      }
      if (!type) {
        throw new Error(`Fragment missing type not found!`);
      } else {
        throw new Error('Fragment type or size is wrong');
      }
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // const fragments = await listFragments(ownerId, expand);
    // return fragments || [];
    return await listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);
    if (!fragment) {
      throw new Error(`Fragment ${id} not found!`);
    }
    // const newFragment = new Fragment({
    //   id: fragment.id,
    //   ownerId: fragment.ownerId,
    //   created: fragment.created,
    //   update: fragment.update,
    //   type: fragment.type,
    //   size: fragment.size,
    // });
    //return Promise.resolve(newFragment);
    return fragment;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Check for the extension to see if it can be converted to a text type
   * @returns bool
   */
  // for a2
  checkTextExtension(ext2) {
    const textTypes = ['plain', 'markdown', 'json', 'html'];

    if (textTypes.find((element) => element == ext2)) return true;

    return false;
  }
  /**
   * Check for the url and convert the result
   * @returns object
   */
  async convertData(buffer, ext2, fragment) {
    let data = buffer.toString('utf-8');

    try {
      if (ext2 === 'html' && fragment.mimeType.startsWith('text/')) {
        data = md.render(data);

        data = Buffer.from(data, 'utf-8');
      }
    } catch (error) {
      // Handle any errors that occur during conversion
      console.error('Error converting data:', error);
      throw new Error('Error converting data');
    }

    return data;
  }
  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    // if (Buffer.isBuffer(data)) {
    //   this.updated = new Date().toString();
    //   this.size = Buffer.byteLength(data);
    //   return writeFragmentData(this.ownerId, this.id, data);
    // } else {
    //   throw new Error(`Data is Empty!`);
    // }
    if (!data) {
      throw new Error('setData need a Buffer passed as parameter');
    }
    this.size = data.length;

    this.updated = new Date().toISOString();
    await this.save();
    return await writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    //return type;
    return type.toString();
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.type.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    let formats = [];
    if (this.type.startsWith('text/plain')) {
      formats = ['text/plain'];
    }
    return formats;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    let validTypes = [
      'text/plain',
      'text/plain; charset=utf-8',
      `text/markdown`,
      `text/html`,
      `application/json`,
      `image/png`,
      `image/jpeg`,
      `image/webp`,
      `image/gif`,
    ];
    return validTypes.includes(value);
  }
}

module.exports.Fragment = Fragment;
