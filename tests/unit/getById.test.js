const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:id').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .post('/v1/fragments/:id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users get fragment data with the given id', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const { id } = JSON.parse(postRes.text).fragment;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toEqual('This is fragment');
  });
});
