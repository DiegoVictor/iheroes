import request from 'supertest';
import Mongoose from 'mongoose';

import app from '../../../src/app';
import Hero from '../../../src/app/models/Hero';
import factory from '../../utils/factory';
import jwtoken from '../../utils/jwtoken';

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

  it('should be able to get a list of heroes', async () => {
    const heroes = await factory.createMany('Hero', 3);
    const { body } = await request(app)
      .get('/heroes')
      .set('Authorization', token)
      .send();

    expect(Array.isArray(body)).toBeTruthy();
    heroes.forEach(hero => {
      expect(body).toContainEqual(
        expect.objectContaining({ _id: hero._id.toString() })
      );
    });
  });

  it('should be able to store a new heroes', async () => {
    const { name, status, rank, location, description } = await factory.attrs(
      'Hero'
    );

    const { body } = await request(app)
      .post('/heroes')
      .set('Authorization', token)
      .send({
        name,
        status,
        rank,
        description,
        longitude: location.coordinates[0],
        latitude: location.coordinates[1],
      });

    expect(body).toMatchObject({
      name,
      status,
      rank,
      location,
      description,
    });
  });

  it('should be able to update an hero', async () => {
    const hero = await factory.create('Hero');
    const { name, status, rank, location, description } = await factory.attrs(
      'Hero'
    );

    const { body } = await request(app)
      .put(`/heroes/${hero._id}`)
      .set('Authorization', token)
      .send({
        name,
        status,
        rank,
        description,
        longitude: location.coordinates[0],
        latitude: location.coordinates[1],
      });

    expect(body).toMatchObject({
      _id: hero._id.toString(),
      name,
      status,
      rank,
      location,
      description,
    });
  });

  it('should not be able to update an hero that not exists', async () => {
    const hero = await factory.create('Hero');
    const { name, status, rank, location, description } = await factory.attrs(
      'Hero'
    );

    await hero.remove();

    const { body } = await request(app)
      .put(`/heroes/${hero._id}`)
      .set('Authorization', token)
      .expect(404)
      .send({
        name,
        status,
        rank,
        description,
        longitude: location.coordinates[0],
        latitude: location.coordinates[1],
      });

    expect(body).toStrictEqual({
      error: {
        message: 'Hero not found',
      },
    });
  });

  it('should not be able to update an hero with a name already in use', async () => {
    const [hero, { name }] = await factory.createMany('Hero', 2);

    const { body } = await request(app)
      .put(`/heroes/${hero._id}`)
      .set('Authorization', token)
      .expect(401)
      .send({ name });

    expect(body).toStrictEqual({
      error: {
        message: 'Name already in use',
      },
    });
  });

  it('should be able to delete an hero', async () => {
    const hero = await factory.create('Hero');

    const { body } = await request(app)
      .delete(`/heroes/${hero._id}`)
      .set('Authorization', token)
      .expect(200)
      .send();

    expect(body).toStrictEqual({
      status: 'success',
    });
  });

  it('should not be able to delete an hero that not exists', async () => {
    const hero = await factory.create('Hero');

    await hero.delete();

    const { body } = await request(app)
      .delete(`/heroes/${hero._id}`)
      .set('Authorization', token)
      .expect(404)
      .send();

    expect(body).toStrictEqual({
      error: {
        message: 'Hero not found',
      },
    });
  });
});
