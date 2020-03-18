import request from 'supertest';
import Mongoose from 'mongoose';
import faker from 'faker';

import app from '../../../../src/app';
import factory from '../../../utils/factory';
import jwtoken from '../../../utils/jwtoken';
import Hero from '../../../../src/app/models/Hero';

let token;

describe('Hero controller', () => {
  beforeAll(async () => {
    const user = await factory.create('User');
    token = `Bearer ${jwtoken(user.id)}`;
  });

  beforeEach(async () => {
    await Hero.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should not be able to update an hero with invalid data', async () => {
    const hero = await factory.create('Hero');
    const { body } = await request(app)
      .put(`/heroes/${hero._id}`)
      .set('Authorization', token)
      .expect(400)
      .send({
        name: faker.random.number(),
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
