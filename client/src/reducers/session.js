import * as actionTypes from '../constants/actionTypes';

export default function session(state = { sessions: [] }, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_NEW_SESSION: {
      return { ...state, sessions: state.sessions.concat([action.payload.session]) };
    }
    case actionTypes.RECEIVE_SESSIONS: {
      return { ...state, sessions: action.payload.sessions };
    }
    case actionTypes.RECEIVE_UPDATED_SESSION: {
      const sessions = [...state.sessions];
      sessions.splice(sessions.findIndex(session => session.id === action.payload.session.id), 1);
      return { ...state, sessions: sessions.concat([action.payload.session]) };
    }
    case actionTypes.RECEIVE_DELETED_SESSION: {
      const sessions = [...state.sessions];
      sessions.splice(sessions.findIndex(session => session.id === action.payload.id), 1);
      return { ...state, sessions };
    }
    default: {
      return state;
    }
  }
}
