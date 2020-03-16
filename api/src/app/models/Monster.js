import { model, Schema } from 'mongoose';

export default model(
  'Monster',
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      location: {
        type: new Schema({
          type: {
            type: String,
            enum: ['Point'],
            required: true,
          },
          coordinates: {
            type: [Number],
            required: true,
          },
        }),
        index: '2dsphere',
      },
      heroes: [Schema.Types.ObjectId],
      status: {
        type: String,
        enum: ['fighting', 'defeated', 'free'],
        required: true,
      },
      rank: {
        type: String,
        enum: ['God', 'Dragon', 'Tiger', 'Wolf'],
        required: true,
      },
    },
    { timestamps: true }
  )
);
