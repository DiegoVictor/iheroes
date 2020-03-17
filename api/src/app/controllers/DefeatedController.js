import Monster from '../models/Monster';
import Hero from '../models/Hero';

class DefeatedController {
  async update(req, res) {
    const { id } = req.params;
    const monster = await Monster.findById(id);

    if (!monster) {
      return res.status(404).son({
        error: {
          message: 'Monster not found',
        },
      });
    }

    const heroes = [];
    req.body.heroes.forEach(({ _id }) => {
      heroes.push(Hero.findById(_id));
    });

    try {
      const result = await Promise.all(heroes);
      result.forEach(async hero => {
        hero.status = req.body.heroes.find(
          h => h._id === hero._id.toString()
        ).status;
        await hero.save();
      });
    } catch (err) {
      return res.status(400).json({
        error: {
          message: `Hero ${err.value} not found`,
        },
      });
    }

    monster.status = 'defeated';
    await monster.save();

    return res.json({});
  }
}

export default new DefeatedController();
