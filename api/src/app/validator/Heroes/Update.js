import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string(),
      latitude: Yup.mixed(),
      longitude: Yup.mixed(),
      rank: Yup.mixed().oneOf(['S', 'A', 'B', 'C']),
      status: Yup.mixed().oneOf([
        'fighting',
        'out_of_combat',
        'patrolling',
        'resting',
      ]),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res.status(400).json({
      error: {
        message: 'Validation fails',
        details: err.inner,
      },
    });
  }
};
