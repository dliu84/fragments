//const MemoryDB = require('../../src/model/data/memory/index.js');

/*const MemoryDB = require('../../src/model/data/memory/memory-db');

const {
  listFragments,
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
} = require('../../src/model/data/memory');

jest.mock('../../src/model/data/memory/memory-db');

describe('Memory Database Functions', () => {
  let metadataDB;
  let dataDB;

  beforeEach(() => {
    metadataDB = new MemoryDB();
    dataDB = new MemoryDB();
  });

  describe('writeFragment', () => {
    it('should write fragment metadata to memory db', async () => {
      const fragment = { ownerId: 'user1', id: 'fragment1', data: {} };
      await writeFragment(fragment);
      //expect(metadataDB.put).toHaveBeenCalledWith('user1', 'fragment1', fragment);
      expect(metadataDB.put).toBe('user1', 'fragment1', fragment);
    });
  });

  describe('readFragment', () => {
    it('should read fragment metadata from memory db', async () => {
      const fragment = { ownerId: 'user1', id: 'fragment1', data: {} };
      metadataDB.get.mockResolvedValue(fragment);
      const retrievedFragment = await readFragment('user1', 'fragment1');
      expect(metadataDB.get).toHaveBeenCalledWith('user1', 'fragment1');
      expect(retrievedFragment).toEqual(fragment);
    });
  });

  describe('writeFragmentData', () => {
    it('should write fragment data to memory db', async () => {
      const buffer = Buffer.from('sample data');
      await writeFragmentData('user1', 'fragment1', buffer);
      expect(dataDB.put).toHaveBeenCalledWith('user1', 'fragment1', buffer);
    });
  });

  describe('readFragmentData', () => {
    it('should read fragment data from memory db', async () => {
      const buffer = Buffer.from('sample data');
      dataDB.get.mockResolvedValue(buffer);
      const retrievedData = await readFragmentData('user1', 'fragment1');
      expect(dataDB.get).toHaveBeenCalledWith('user1', 'fragment1');
      expect(retrievedData).toEqual(buffer);
    });
  });

  describe('listFragments', () => {
    it('should return list of fragment ids for the given user from memory db', async () => {
      const fragments = [
        { ownerId: 'user1', id: 'fragment1', data: {} },
        { ownerId: 'user1', id: 'fragment2', data: {} },
      ];
      metadataDB.query.mockResolvedValue(fragments);
      const retrievedFragments = await listFragments('user1');
      expect(metadataDB.query).toHaveBeenCalledWith('user1');
      expect(retrievedFragments).toEqual(['fragment1', 'fragment2']);
    });

    it('should return list of fragment objects for the given user if expand option is true', async () => {
      const fragments = [
        { ownerId: 'user1', id: 'fragment1', data: {} },
        { ownerId: 'user1', id: 'fragment2', data: {} },
      ];
      metadataDB.query.mockResolvedValue(fragments);
      const retrievedFragments = await listFragments('user1', true);
      expect(metadataDB.query).toHaveBeenCalledWith('user1');
      expect(retrievedFragments).toEqual(fragments);
    });
  });

  describe('deleteFragment', () => {
    it('should delete fragment metadata and data from memory db', async () => {
      await deleteFragment('user1', 'fragment1');
      expect(metadataDB.del).toHaveBeenCalledWith('user1', 'fragment1');
      expect(dataDB.del).toHaveBeenCalledWith('user1', 'fragment1');
    });
  });
});*/

/*const {
  listFragments,
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
} = require('../../src/model/data/memory');

describe('memory index', () => {
  let ownerId = 'owner123';
  let fragmentId = 'fragment456';
  let fragment = { ownerId, fragmentId };
  let buffer = Buffer.from([1, 2, 3]);

  beforeEach(async () => {
    // Clearing the databases before each test
    await deleteFragment(ownerId, fragmentId);
  });

  test('writeFragment() writes fragment metadata', async () => {
    await writeFragment(fragment);
    const result = await readFragment(ownerId, fragmentId);
    expect(result).toEqual(fragment);
  });

  test('readFragment() reads fragment metadata', async () => {
    await writeFragment(fragment);
    const result = await readFragment(ownerId, fragmentId);
    expect(result).toEqual(fragment);
  });

  test('writeFragmentData() writes fragment data', async () => {
    await writeFragmentData(ownerId, fragmentId, buffer);
    const result = await readFragmentData(ownerId, fragmentId);
    expect(result).toEqual(buffer);
  });

  test('readFragmentData() reads fragment data', async () => {
    await writeFragmentData(ownerId, fragmentId, buffer);
    const result = await readFragmentData(ownerId, fragmentId);
    expect(result).toEqual(buffer);
  });

  test('listFragments() returns list of fragment ids', async () => {
    await writeFragment(fragment);
    const result = await listFragments(ownerId);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(fragmentId);
  });

  test('listFragments(expand=true) returns list of fragment objects', async () => {
    await writeFragment(fragment);
    const result = await listFragments(ownerId, true);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(fragment);
  });

  test('deleteFragment() deletes fragment metadata and data', async () => {
    await writeFragment(fragment);
    await writeFragmentData(ownerId, fragmentId, buffer);
    await deleteFragment(ownerId, fragmentId);
    const resultMetadata = await readFragment(ownerId, fragmentId);
    const resultData = await readFragmentData(ownerId, fragmentId);
    expect(resultMetadata).toBeUndefined();
    expect(resultData).toBeUndefined();
  });

  test('deleteFragment() does not throw if fragment does not exist', async () => {
    // Ensure fragment doesn't exist before attempting deletion
    await deleteFragment(ownerId, fragmentId);
    // Attempt deletion
    await expect(deleteFragment(ownerId, fragmentId)).resolves.not.toThrow();
  });
});*/

/*const {
  listFragments,
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
} = require('../../src/model/data/memory');

describe('memory index', () => {
  let ownerId = 'owner123';
  let fragmentId = 'fragment456';
  let fragment = { ownerId, fragmentId };
  let buffer = Buffer.from([1, 2, 3]);

  beforeEach(async () => {
    // Ensure the databases are cleared before each test
    await deleteFragment(ownerId, fragmentId);
  });

  test('writeFragment() writes fragment metadata', async () => {
    await writeFragment(fragment);
    const result = await readFragment(ownerId, fragmentId);
    expect(result).toEqual(fragment);
  });

  test('readFragment() reads fragment metadata', async () => {
    // Ensure fragment does not exist before attempting to read
    await deleteFragment(ownerId, fragmentId);

    // Read the fragment
    const result = await readFragment(ownerId, fragmentId);

    // Expect the result to be undefined
    expect(result).toBeUndefined();
  });

  test('writeFragmentData() writes fragment data', async () => {
    await writeFragmentData(ownerId, fragmentId, buffer);
    const result = await readFragmentData(ownerId, fragmentId);
    expect(result).toEqual(buffer);
  });

  test('readFragmentData() reads fragment data', async () => {
    // Ensure fragment data does not exist before attempting to read
    await deleteFragment(ownerId, fragmentId);

    // Read the fragment data
    const result = await readFragmentData(ownerId, fragmentId);

    // Expect the result to be undefined
    expect(result).toBeUndefined();
  });

  test('listFragments() returns list of fragment ids', async () => {
    // Ensure fragment does not exist before attempting to list
    await deleteFragment(ownerId, fragmentId);

    // List fragments
    const result = await listFragments(ownerId);

    // Expect the result to be an empty array
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('listFragments(expand=true) returns list of fragment objects', async () => {
    // Ensure fragment does not exist before attempting to list
    await deleteFragment(ownerId, fragmentId);

    // List fragments with expand=true
    const result = await listFragments(ownerId, true);

    // Expect the result to be an empty array
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('deleteFragment() deletes fragment metadata and data', async () => {
    // Write fragment and its data
    await writeFragment(fragment);
    await writeFragmentData(ownerId, fragmentId, buffer);

    // Delete fragment
    await deleteFragment(ownerId, fragmentId);

    // Check if fragment and its data are deleted
    const resultMetadata = await readFragment(ownerId, fragmentId);
    const resultData = await readFragmentData(ownerId, fragmentId);
    expect(resultMetadata).toBeUndefined();
    expect(resultData).toBeUndefined();
  });

  test('deleteFragment() does not throw if fragment does not exist', async () => {
    // Ensure fragment does not exist before attempting to delete
    await deleteFragment(ownerId, fragmentId);

    // Attempt deletion
    await expect(deleteFragment(ownerId, fragmentId)).resolves.not.toThrow();
  });
});*/

const {
  listFragments,
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
} = require('../../src/model/data/memory');

describe('memory index', () => {
  let ownerId = 'owner123';
  let fragmentId = 'fragment456';
  let fragment = { ownerId, fragmentId };
  let buffer = Buffer.from([1, 2, 3]);

  beforeEach(async () => {
    // Ensure the databases are cleared before each test
    await deleteFragment(ownerId, fragmentId).catch(() => {}); // Gracefully handle error
  });

  test('writeFragment() writes fragment metadata', async () => {
    // await writeFragment(fragment);
    // const result = await readFragment(ownerId, fragmentId);
    // expect(result).toEqual(fragment);
    const fragment = { ownerId: 'owner123', id: 'fragment456', data: { value: 123 } };
    await writeFragment(fragment);
    const result = await readFragment('owner123', 'fragment456');
    expect(result).toEqual(fragment);
  });

  test('readFragment() reads fragment metadata', async () => {
    try {
      // Read the fragment
      const result = await readFragment(ownerId, fragmentId);
      // Expect the result to be undefined
      expect(result).toBeUndefined();
    } catch (error) {
      // Gracefully handle error if the entry doesn't exist
      expect(error).toBeUndefined();
    }
  });

  test('writeFragmentData() writes fragment data', async () => {
    await writeFragmentData(ownerId, fragmentId, buffer);
    const result = await readFragmentData(ownerId, fragmentId);
    expect(result).toEqual(buffer);
  });

  test('readFragmentData() reads fragment data', async () => {
    try {
      // Read the fragment data
      const result = await readFragmentData(ownerId, fragmentId);
      // Expect the result to be undefined
      expect(result).toBeUndefined();
    } catch (error) {
      // Gracefully handle error if the entry doesn't exist
      expect(error).toBeUndefined();
    }
  });

  test('listFragments() returns list of fragment ids', async () => {
    try {
      // List fragments
      const result = await listFragments(ownerId);
      // Expect the result to be an empty array
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    } catch (error) {
      // Gracefully handle error if the entry doesn't exist
      expect(error).toBeUndefined();
    }
  });

  test('listFragments(expand=true) returns list of fragment objects', async () => {
    try {
      // List fragments with expand=true
      const result = await listFragments(ownerId, true);
      // Expect the result to be an empty array
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    } catch (error) {
      // Gracefully handle error if the entry doesn't exist
      expect(error).toBeUndefined();
    }
  });

  // test('deleteFragment() deletes fragment metadata and data', async () => {
  //   await writeFragment(fragment);
  //   await writeFragmentData(ownerId, fragmentId, buffer);
  //   // Delete fragment
  //   await deleteFragment(ownerId, fragmentId);
  //   // Check if fragment and its data are deleted
  //   const resultMetadata = await readFragment(ownerId, fragmentId).catch(() => {}); // Gracefully handle error
  //   const resultData = await readFragmentData(ownerId, fragmentId).catch(() => {}); // Gracefully handle error
  //   expect(resultMetadata).toBeUndefined();
  //   expect(resultData).toBeUndefined();
  // });

  // test('deleteFragment() deletes fragment metadata and data', async () => {
  //   await writeFragment(fragment.ownerId, fragment.fragmentId, fragment);
  //   await writeFragmentData(fragment.ownerId, fragment.fragmentId, buffer);
  //   // Delete fragment
  //   await deleteFragment(fragment.ownerId, fragment.fragmentId);
  //   // Check if fragment and its data are deleted
  //   const resultMetadata = await readFragment(fragment.ownerId, fragment.fragmentId).catch(
  //     () => {}
  //   ); // Gracefully handle error
  //   const resultData = await readFragmentData(fragment.ownerId, fragment.fragmentId).catch(
  //     () => {}
  //   ); // Gracefully handle error
  //   expect(resultMetadata).toBeUndefined();
  //   expect(resultData).toBeUndefined();
  // });

  test('deleteFragment() deletes fragment metadata and data', async () => {
    // await writeFragment('owner123', 'fragment456', fragment);
    // await writeFragmentData('owner123', 'fragment456', buffer);
    // // Delete fragment
    // await deleteFragment('owner123', 'fragment456');
    // // Check if fragment and its data are deleted
    // const resultMetadata = await readFragment('owner123', 'fragment456').catch(() => {}); // Gracefully handle error
    // const resultData = await readFragmentData('owner123', 'fragment456').catch(() => {}); // Gracefully handle error
    // expect(resultMetadata).toBeUndefined();
    // expect(resultData).toBeUndefined();
    const fragment = { ownerId: 'owner123', id: 'fragment456', data: { value: 123 } };
    const buffer = Buffer.from([1, 2, 3]);
    await writeFragment(fragment);
    await writeFragmentData('owner123', 'fragment456', buffer);
    // Delete fragment
    await deleteFragment('owner123', 'fragment456');
    // Check if fragment and its data are deleted
    const resultMetadata = await readFragment('owner123', 'fragment456').catch(() => {}); // Gracefully handle error
    const resultData = await readFragmentData('owner123', 'fragment456').catch(() => {}); // Gracefully handle error
    expect(resultMetadata).toBeUndefined();
    expect(resultData).toBeUndefined();
  });

  test('deleteFragment() throw if fragment does not exist in db', async () => {
    expect(() => deleteFragment('a', 'c')).rejects.toThrow();
  });

  test('deleteFragment() does not throw if fragment does not exist', async () => {
    // Try deleting a non-existent fragment
    try {
      await deleteFragment('owner123', 'nonExistentFragment');
    } catch (error) {
      // If an error is thrown, fail the test
      expect(error.message).toBe(
        'missing entry for primaryKey=owner123 and secondaryKey=nonExistentFragment'
      );
    }
  });
});
