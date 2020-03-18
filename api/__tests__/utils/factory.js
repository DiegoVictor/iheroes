import { factory } from 'factory-girl';
import faker from 'faker';

import Hero from '../../src/app/models/Hero';
import Monster from '../../src/app/models/Monster';
import User from '../../src/app/models/User';

factory.define('Hero', Hero, {
  name: faker.name.firstName,
  description: faker.lorem.paragraph,
  location: () => ({
    type: 'Point',
    coordinates: [
      Number(faker.address.longitude()),
      Number(faker.address.latitude()),
    ],
  }),
  rank: () => faker.random.arrayElement(['S', 'A', 'B', 'C']),
  status: () =>
    faker.random.arrayElement([
      'fighting',
      'out_of_combat',
      'patrolling',
      'resting',
    ]),
});

factory.define('Monster', Monster, async () => {
  const heroes = await factory.create('Hero', { rank: 'S' });

  return {
    name: faker.name.findName,
    location: () => ({
      type: 'Point',
      coordinates: [
        Number(faker.address.longitude()),
        Number(faker.address.latitude()),
      ],
    }),
    heroes,
    status: () => faker.random.arrayElement(['fighting', 'defeated', 'free']),
    rank: faker.random.arrayElement(['God', 'Dragon', 'Tiger', 'Wolf']),
  };
});

factory.define('User', User, {
  name: faker.name.findName,
  email: faker.internet.email,
  password: faker.internet.password,
});

export default factory;
