import { RECEIVE_SESSIONS } from '../constants/actionTypes';

export default function session(state = [], action) {
  switch(action.type) {
    case RECEIVE_SESSIONS: {
      return action.payload.sessions;
    }
    default: {
      return state;
    }
  }
}
