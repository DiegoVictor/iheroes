import request from 'supertest';
import Mongoose from 'mongoose';

import app from '../../../src/app';
import Hero from '../../../src/app/models/Hero';
import Monster from '../../../src/app/models/Monster';
import factory from '../../utils/factory';
import jwtoken from '../../utils/jwtoken';

let token;

describe('Defeated controller', () => {
  beforeAll(async () => {
    const user = await factory.create('User');
    token = `Bearer ${jwtoken(user.id)}`;
  });

  beforeEach(async () => {
    await Hero.deleteMany();
    await Monster.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to set a monster as defeated', async () => {
    const { _id } = await factory.create('Monster', { heroes: [] });
    const hero = await factory.create('Hero', { status: 'fighting' });

    const { body } = await request(app)
      .put(`/monsters/${_id}/defeated`)
      .set('Authorization', token)
      .send({
        heroes: [
          {
            _id: hero._id,
            status: 'resting',
          },
        ],
      });

    expect(body).toMatchObject({
      _id: _id.toString(),
      status: 'defeated',
      heroes: [hero._id.toString()],
    });
    expect(await Hero.findById(hero._id)).toMatchObject({ status: 'resting' });
  });

  it('should not be able to set a monster that not exists as defeated', async () => {
    const monster = await factory.create('Monster', { heroes: [] });
    const hero = await factory.create('Hero', { status: 'fighting' });

    await monster.delete();

    const { body } = await request(app)
      .put(`/monsters/${monster._id}/defeated`)
      .set('Authorization', token)
      .expect(404)
      .send({
        heroes: [
          {
            _id: hero._id,
            status: 'resting',
          },
        ],
      });

    expect(body).toStrictEqual({
      error: {
        message: 'Monster not found',
      },
    });
  });

  it('should not be able to set a monster as defeated by hero that not exists', async () => {
    const monster = await factory.create('Monster', { heroes: [] });
    const hero = await factory.create('Hero', { status: 'fighting' });

    await hero.delete();

    const { body } = await request(app)
      .put(`/monsters/${monster._id}/defeated`)
      .set('Authorization', token)
      .expect(400)
      .send({
        heroes: [
          {
            _id: hero._id,
            status: 'resting',
          },
        ],
      });

    expect(body).toStrictEqual({
      error: {
        message: 'Hero not found',
      },
    });
  });
});
