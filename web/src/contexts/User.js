import { createContext } from 'react';

let user = {};
if (typeof localStorage.iheroes_user !== 'undefined') {
  user = JSON.parse(localStorage.getItem('iheroes_user'));
}

export default createContext(user);
