import io from 'socket.io-client';

import priorities from './config/priorities.json';
import Monster from './app/models/Monster';
import Hero from './app/models/Hero';

const socket = io(process.env.MONSTER_WEBSOCKET, {
  autoConnect: false,
});

const getHeroesNearIn = async (latitude, longitude, meters, cb) => {
  const heroes = await Hero.find({
    status: { $nin: ['fighting', 'out_of_combat'] },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: meters,
      },
    },
  });

  if (!cb(heroes)) {
    await getHeroesNearIn(latitude, longitude, meters + meters, cb);
  }
};

export function connect() {
  socket.connect();

  socket.on('occurrence', async ({ monsterName, dangerLevel, location }) => {
    const { lat, lng } = location.pop();
    const allocated_heroes = [];

    await getHeroesNearIn(lat, lng, 10000, heroes => {
      return !priorities[dangerLevel].every(({ rank, quantity }) => {
        const heroes_with_rank = heroes.filter(hero => hero.rank === rank);

        if (heroes_with_rank.length >= quantity) {
          heroes_with_rank.forEach(async hero => {
            hero.status = 'fighting';
            await hero.save();
          });
          allocated_heroes.push(...heroes_with_rank.splice(0, quantity));

          return false;
        }

        return true;
      });
    });

    await Monster.create({
      name: monsterName,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      rank: dangerLevel,
      heroes: allocated_heroes.map(hero => hero._id),
      status: 'fighting',
    });
  });
}

export function disconnect() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export default socket;
