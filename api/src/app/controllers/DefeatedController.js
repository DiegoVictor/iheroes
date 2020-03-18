import Monster from '../models/Monster';
import Hero from '../models/Hero';

class DefeatedController {
  async update(req, res) {
    const { id } = req.params;
    const monster = await Monster.findById(id);

    if (!monster) {
      return res.status(404).json({
        error: {
          message: 'Monster not found',
        },
      });
    }

    const heroes = [];
    req.body.heroes.forEach(({ _id }) => {
      heroes.push(Hero.findById(_id));
    });

    let found_all_heroes = true;

    const result = await Promise.all(heroes);
    result.every(async hero => {
      if (hero) {
        hero.status = req.body.heroes.find(
          h => h._id === hero._id.toString()
        ).status;
        await hero.save();
        monster.heroes.push(hero._id);
        return true;
      }

      found_all_heroes = false;
      return false;
    });

    if (!found_all_heroes) {
      return res.status(400).json({
        error: {
          message: `Hero not found`,
        },
      });
    }

    monster.status = 'defeated';
    await monster.save();

    return res.json(monster);
  }
}

export default new DefeatedController();
