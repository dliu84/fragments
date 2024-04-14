const request = require('supertest');
//var path = require('path');

const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).put('/v1/fragments/whatever').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .put('/v1/fragments/whatever')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // User with valid username/password pair should be able to update a plain text fragment
  // responses include all necessary and expected properties (id, created, type, etc),
  // and these values match what you expect for a given request (e.g., size and type)
  test('authenticated users update a plain text fragment, response include expected properties', async () => {
    const data = Buffer.from('hello');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send(data);
    const { id } = JSON.parse(postRes.text).fragment;

    const dataUpdated = Buffer.from('helloUpdated');
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send(dataUpdated);

    const body = JSON.parse(putRes.text);

    expect(putRes.statusCode).toBe(201);
    expect(body.status).toBe('ok');
    expect(body.fragment.type).toMatch(/text\/plain+/);
    expect(body.fragment.size).toEqual(12);
  });

  // If no such fragment exists with the given id, returns an HTTP 404 with an appropriate error message.
  test('if no id found, returns 404 error', async () => {
    const putRes = await request(app)
      .put('/v1/fragments/randomid')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is updated fragment');

    expect(putRes.statusCode).toBe(404);
  });
});
