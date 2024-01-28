// test/unit/app.test.js file

const request = require('supertest');

const app = require('../../src/app');

describe('Should cover 404 handler', () => {
  test('should respond with a 404 error', async () => {
    const response = await request(app).get('/whatever-route');

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});
