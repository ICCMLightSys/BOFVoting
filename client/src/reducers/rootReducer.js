import { combineReducers } from 'redux';
import optimist from 'redux-optimist';
import conference from './conference';
import session from './session';
import user from './user';
import vote from './vote';
import facilitate from './facilitate';
import room from './room';
import time from './time';
import slot from './slot';

const root = optimist(combineReducers({
  conference,
  session,
  user,
  vote,
  facilitate,
  room,
  slot,
  time
}));

export default root;
