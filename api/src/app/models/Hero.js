import { model, Schema } from 'mongoose';

export const HeroSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    rank: {
      type: String,
      enum: ['S', 'A', 'B', 'C'],
      required: true,
    },
    status: {
      type: String,
      enum: ['fighting', 'out_of_combat', 'patrolling', 'resting'],
      required: true,
    },
  },
  { timestamps: true, collection: 'heroes' }
);

export default model('Hero', HeroSchema);
