// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

var md = require('markdown-it')();
const sharp = require('sharp');
const logger = require('../logger');

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
      this.created = created || new Date().toISOString();
      this.updated = updated || new Date().toISOString();
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
    try {
      const fragments = await listFragments(ownerId, expand);
      return expand ? fragments.map((fragment) => new Fragment(fragment)) : fragments;
    } catch (error) {
      // if the user does not have fragments yet, returns an empty array
      return [];
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      const fragment = await readFragment(ownerId, id);
      if (!fragment) {
        throw new Error(`Fragment ${id} not found!`);
      }
      return fragment;
    } catch (error) {
      throw new Error(error);
    }
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
    this.updated = new Date().toISOString();
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
  checkTextExtension(ext2) {
    const textTypes = ['plain', 'markdown', 'json', 'html'];
    if (textTypes.find((element) => element == ext2)) return true;
    return false;
  }

  /**
   * Check for the extension to see if it can be converted to a image type
   * @returns bool
   */
  checkImageExtension(ext2) {
    const imageTypes = ['png', 'jpeg', 'webp', 'gif'];
    if (imageTypes.find((element) => element == ext2)) return true;
    return false;
  }

  /**
   * Check for the url and convert the result
   * @returns object
   */
  async convertData(buffer, ext2, fragment) {
    let data;

    try {
      if (this.checkImageExtension(ext2)) {
        data = await sharp(buffer).toFormat(ext2).toBuffer();
        return data;
      }
    } catch (err) {
      throw 'Error parsing image in src/model/fragment.js';
    }

    //markdown-it
    if (this.checkTextExtension(ext2)) {
      if (ext2 == 'html' && fragment.mimeType.startsWith('text/')) {
        data = buffer;

        logger.debug({ data }, 'Before markdown-it ToString in src/model/fragments.js');

        data = md.render(data.toString('utf-8'));

        logger.debug({ data }, 'After markdown-it ToString in src/model/fragments.js');

        data = Buffer.from(data, 'utf-8');

        logger.debug({ data }, 'After Converting to Buffer again in src/model/fragments.js');

        return data;
      }

      //json extension
      if (
        ext2 == 'json' &&
        (fragment.mimeType.startsWith('text/') || fragment.mimeType.startsWith('application'))
      ) {
        data = buffer;

        data = JSON.parse(data.toString('utf-8'));

        data = Buffer.from(JSON.stringify(data), 'utf-8');

        logger.debug({ data }, 'After Converting to Buffer again in src/model/fragments.js');

        return data;
      }

      // plain text
      if (ext2 == 'plain' && fragment.mimeType.startsWith('text/')) {
        return data;
      }
    } else {
      throw new Error();
    }
  }
  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    try {
      if (!data || data == undefined) {
        throw new Error('setData need a Buffer passed as parameter');
      }

      this.size = data.byteLength;

      this.updated = new Date().toISOString();

      await this.save();

      return await writeFragmentData(this.ownerId, this.id, data);
    } catch (err) {
      return Promise.reject(new Error('Error in setData:', err));
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
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
    } else if (this.type.startsWith('application/json')) {
      formats = ['application/json'];
    } else if (this.type.startsWith('text/markdown')) {
      formats = ['text/markdown'];
    } else if (this.type.startsWith('text/html')) {
      formats = ['text/html'];
    } else if (this.type.startsWith('image/png')) {
      formats = ['image/png'];
    } else if (this.type.startsWith('image/webp')) {
      formats = ['image/webp'];
    } else if (this.type.startsWith('image/gif')) {
      formats = ['image/gif'];
    }
    return formats;
    // return [
    //   'text/plain',
    //   'application/json',
    //   'text/markdown',
    //   'text/html',
    //   'image/png',
    //   'image/jpeg',
    //   'image/webp',
    //   'image/gif',
    // ];
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
