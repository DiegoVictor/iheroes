import 'dotenv/config';
import Express from 'express';
import cors from 'cors';
import Mongoose from 'mongoose';

import routes from './routes';
import { connect } from './websocket';

const App = Express();

Mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

connect();

App.use(cors());
App.use(Express.json());

App.use(routes);

export default App;
