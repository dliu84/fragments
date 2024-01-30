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
  let buffer = Buffer.from([1, 2, 3]);

  beforeEach(async () => {
    // Ensure the databases are cleared before each test
    await deleteFragment(ownerId, fragmentId).catch(() => {}); // Gracefully handle error
  });

  test('writeFragment() writes fragment metadata', async () => {
    const fragment = { ownerId: 'owner123', id: 'fragment456', data: { value: 123 } };
    await writeFragment(fragment);
    const result = await readFragment('owner123', 'fragment456');
    expect(result).toEqual(fragment);
  });

  test('readFragment() reads fragment metadata', async () => {
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
    // Read the fragment data
    const result = await readFragmentData(ownerId, fragmentId);
    // Expect the result to be undefined
    expect(result).toBeUndefined();
  });

  test('listFragments() returns list of fragment ids', async () => {
    // List fragments
    const result = await listFragments(ownerId);
    // Expect the result to be an empty array
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('listFragments(expand=true) returns list of fragment objects', async () => {
    // List fragments with expand=true
    const result = await listFragments(ownerId, true);
    // Expect the result to be an empty array
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('deleteFragment() deletes fragment metadata and data', async () => {
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
    expect(() => deleteFragment('owner123', 'nonExistentFragment')).rejects.toThrow();
  });
});
