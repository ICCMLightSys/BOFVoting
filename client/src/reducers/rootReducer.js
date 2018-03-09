import { combineReducers } from 'redux';
import optimist from 'redux-optimist';
import conference from './conference';
import session from './session';
import user from './user';
import vote from './vote';
import facilitate from './facilitate';

const root = optimist(combineReducers({
  conference,
  session,
  user,
  vote,
  facilitate,
}));

export default root;