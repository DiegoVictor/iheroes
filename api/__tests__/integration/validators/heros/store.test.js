import request from 'supertest';
import Mongoose from 'mongoose';
import faker from 'faker';

import app from '../../../../src/app';
import factory from '../../../utils/factory';
import jwtoken from '../../../utils/jwtoken';

let token;

describe('Hero controller', () => {
  beforeAll(async () => {
    const user = await factory.create('User');
    token = `Bearer ${jwtoken(user.id)}`;
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should not be able to store a new hero with invalid data', async () => {
    const { body } = await request(app)
      .post('/heroes')
      .set('Authorization', token)
      .expect(400)
      .send({
        name: faker.random.number(),
        longitude: faker.lorem.word(),
        rank: faker.phone.phoneNumber(),
        status: faker.address.latitude(),
      });

    expect(body).toMatchObject({
      error: {
        message: 'Validation fails',
      },
    });
  });
});
