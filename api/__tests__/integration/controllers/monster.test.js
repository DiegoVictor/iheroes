import request from 'supertest';
import Mongoose from 'mongoose';

import app from '../../../src/app';
import factory from '../../utils/factory';
import jwtoken from '../../utils/jwtoken';
import Monster from '../../../src/app/models/Monster';

let token;

describe('Monster controller', () => {
  beforeAll(async () => {
    const user = await factory.create('User');
    token = `Bearer ${jwtoken(user.id)}`;
  });

  beforeEach(async () => {
    await Monster.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of monsters', async () => {
    const monsters = await factory.createMany('Monster', 3);
    const { body } = await request(app)
      .get('/monsters')
      .set('Authorization', token)
      .send();

    expect(Array.isArray(body)).toBeTruthy();
    monsters.forEach(monster => {
      expect(body).toContainEqual(
        expect.objectContaining({ _id: monster._id.toString() })
      );
    });
  });

  it('should be able to get a list of defeated monsters', async () => {
    const status = 'defeated';
    const monsters = await factory.createMany('Monster', 3, [
      { status },
      { status: 'fighting' },
      { status: 'free' },
    ]);
    const { body } = await request(app)
      .get(`/monsters?status=${status}`)
      .set('Authorization', token)
      .send();

    expect(Array.isArray(body)).toBeTruthy();
    monsters.forEach(monster => {
      if (monster.status === status) {
        expect(body).toContainEqual(
          expect.objectContaining({ _id: monster._id.toString() }),
          status
        );
      }
    });
  });
});
