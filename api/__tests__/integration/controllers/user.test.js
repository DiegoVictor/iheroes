import request from 'supertest';
import Mongoose from 'mongoose';

import app from '../../../src/app';
import User from '../../../src/app/models/User';
import factory from '../../utils/factory';

describe('User controller', () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to store a new user', async () => {
    const { name, email, password } = await factory.attrs('User');
    const { body } = await request(app)
      .post('/users')
      .send({ name, email, password });

    expect(body).toMatchObject({ name, email });
  });

  it('should not be able to store a new user with a duplicated email', async () => {
    const [{ email }, { name, password }] = await factory.createMany('User', 2);
    const { body } = await request(app)
      .post('/users')
      .expect(401)
      .send({ name, email, password });

    expect(body).toStrictEqual({
      error: {
        message: 'Email already in use',
      },
    });
  });
});
