import { combineReducers } from 'redux';
import user from './user';
import session from './session';
import conference from './conference';

const root = combineReducers({
  user,
  session,
  conference
});

export default root;