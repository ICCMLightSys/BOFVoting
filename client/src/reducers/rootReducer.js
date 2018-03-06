import { combineReducers } from 'redux';
import conference from './conference';
import session from './session';
import user from './user';
import vote from './vote';
import facilitate from './facilitate';

const root = combineReducers({
  conference,
  session,
  user,
  vote,
  facilitate,
});

export default root;