import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.mixed().required(),
      longitude: Yup.mixed().required(),
      rank: Yup.mixed()
        .oneOf(['S', 'A', 'B', 'C'])
        .required(),
      status: Yup.mixed()
        .oneOf(['fighting', 'out_of_combat', 'patrolling', 'resting'])
        .required(),
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
