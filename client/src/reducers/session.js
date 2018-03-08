import * as actionTypes from '../constants/actionTypes';

export default function session(state = { sessions: [] }, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_SESSION: {
      return { ...state, sessions: state.sessions.concat([action.payload.session]) };
    }
    case actionTypes.RECEIVE_SESSIONS: {
      return { ...state, sessions: action.payload.sessions };
    }
    default: {
      return state;
    }
  }
}
