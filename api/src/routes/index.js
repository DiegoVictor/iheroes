import { Router } from 'express';

import Auth from '../app/middlewares/Auth';
import SessionController from '../app/controllers/SessionController';
import UserController from '../app/controllers/UserController';
import HeroController from '../app/controllers/HeroController';
import MonsterController from '../app/controllers/MonsterController';
import DefeatedController from '../app/controllers/DefeatedController';

import HeroStore from '../app/validators/Heroes/Store';
import HeroUpdate from '../app/validators/Heroes/Update';

const Route = Router();

Route.post('/sessions', SessionController.store);
Route.post('/users', UserController.store);

Route.use(Auth);

Route.get('/heroes', HeroController.index);
Route.post('/heroes', HeroStore, HeroController.store);
Route.put('/heroes/:id', HeroUpdate, HeroController.update);
Route.delete('/heroes/:id', HeroController.destroy);

Route.get('/monsters', MonsterController.index);

Route.put('/monsters/:id/defeated', DefeatedController.update);

export default Route;
