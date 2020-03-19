import factory from 'factory-girl';
import faker from 'faker';

factory.define(
  'Hero',
  {},
  {
    _id: faker.random.number,
    name: faker.name.findName,
    description: faker.lorem.paragraph,
    location: () => ({
      coordinates: [faker.address.longitude(), faker.address.latitude()],
    }),
    status: () =>
      faker.random.arrayElement(['resting', 'out_of_combat', 'patrolling']),
    rank: faker.random.arrayElement(['S', 'A', 'B', 'C']),
  }
);

factory.define('Monster', {}, async () => {
  const hero = await factory.attrs('Hero');
  return {
    _id: faker.random.number,
    name: faker.name.findName,
    rank: faker.random.arrayElement(['God', 'Dragon', 'Tiger', 'Wolf']),
    location: () => ({
      coordinates: [faker.address.longitude(), faker.address.latitude()],
    }),
    heroes: [hero],
    status: faker.random.arrayElement(['fighting', 'defeated']),
  };
});

factory.define(
  'User',
  {},
  {
    name: faker.name.findName,
    email: faker.internet.email,
    password: faker.internet.password,
  }
);

export default factory;
