import request from 'supertest';
import Mongoose from 'mongoose';
import faker from 'faker';

import app from '../../../src/app';
import User from '../../../src/app/models/User';
import factory from '../../utils/factory';

describe('Session controller', () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to login', async () => {
    const { name, email, password } = await factory.attrs('User');
    const user = await User.create({ name, email, password });
    const { body } = await request(app)
      .post('/sessions')
      .send({ email, password });

    expect(body).toMatchObject({
      user: { _id: user._id.toString(), email, name },
      token: expect.any(String),
    });
  });

  it('should not be able to login with user that not exists', async () => {
    const { email, password } = await factory.attrs('User');
    const { body } = await request(app)
      .post('/sessions')
      .expect(404)
      .send({ email, password });

    expect(body).toStrictEqual({
      error: {
        message: 'User not exists',
      },
    });
  });

  it('should be able to login', async () => {
    const wrong_password = faker.internet.password();
    const { name, email, password } = await factory.attrs('User');
    await User.create({ name, email, password });

    const { body } = await request(app)
      .post('/sessions')
      .expect(400)
      .send({ email, password: wrong_password });

    expect(body).toMatchObject({
      error: {
        message: 'User and/or password not match',
      },
    });
  });
});
