import * as actionTypes from '../constants/actionTypes';

<<<<<<< HEAD
const defaultState = { sessions: [], sessionsUpdating: [] };

export default function session(state = defaultState, action) {
=======
export default function session(state = { sessions: [], sessionsUpdating: [], fetchingSessions: false }, action) {
>>>>>>> Add loading text when sessions are loading
  switch(action.type) {
    case actionTypes.RECEIVE_NEW_SESSION: {
      return { ...state, sessions: state.sessions.concat([action.payload.session]) };
    }
    case actionTypes.START_FETCHING_SESSIONS: {
      return { ...state, fetchingSessions: true };
    }
    case actionTypes.RECEIVE_SESSIONS: {
      return { ...state, sessions: action.payload.sessions, fetchingSessions: false };
    }
    case actionTypes.START_UPDATING_SESSION: {
      return { ...state, sessionsUpdating: state.sessionsUpdating.concat([action.payload.id]) };
    }
    case actionTypes.RECEIVE_UPDATED_SESSION: {
      const sessions = [...state.sessions];
      sessions.splice(sessions.findIndex(session => session.id === action.payload.session.id), 1);
      const sessionsUpdating = [...state.sessionsUpdating];
      sessionsUpdating.splice(sessionsUpdating.findIndex(id => id === action.payload.session.id), 1);
      return { ...state, sessions: sessions.concat([action.payload.session]), sessionsUpdating };
    }
    case actionTypes.RECEIVE_DELETED_SESSION: {
      const sessions = [...state.sessions];
      sessions.splice(sessions.findIndex(session => session.id === action.payload.id), 1);
      return { ...state, sessions };
    }
    case actionTypes.RECEIVE_MERGED_SESSION: {
      const { session, sourceSessionId } = action.payload;
      const destinationSessionId = session.id;
      const sessions = [...state.sessions];
      sessions.splice(sessions.findIndex(session => session.id === sourceSessionId), 1);
      const indexToReplace = sessions.findIndex(session => session.id === destinationSessionId);
      sessions[indexToReplace] = session;
      return { ...state, sessions };
    }
    case actionTypes.LOGOUT: {
      return defaultState;
    }
    default: {
      return state;
    }
  }
}
