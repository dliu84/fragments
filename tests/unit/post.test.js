const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('create a fragment with an unsupported type errors as expected', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'abc/defg');
    expect(res.statusCode).toBe(415);
  });

  test('post without data does not work', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send();

    expect(res.statusCode).toBe(500);
  });

  test('authenticated users can create a plain text fragment', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(res.statusCode).toBe(201);
    expect(res.text.includes('text/plain'));
  });

  test('responses include all necessary and expected properties', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    const body = JSON.parse(res.text);
    expect(Object.keys(body.fragment)).toEqual([
      'id',
      'ownerId',
      'created',
      'updated',
      'type',
      'size',
    ]);
    expect(body.fragment.size).toEqual(data.byteLength);
    expect(body.fragment.type).toContain('text/plain');
  });

  // If an invalid username/password pair are used, it should be denied
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  test('response include a Location header with a URL to GET the fragment', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toEqual(
      `${process.env.API_URL}/v1/fragments/${JSON.parse(res.text).fragment.id}`
    );
  });
});
