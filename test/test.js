const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ first_name: 'paul', last_name: 'oladipo', email: 'paulo@example.com', password: 'pass1234' });
    expect(res.statusCode).toEqual(201);
  });
});
