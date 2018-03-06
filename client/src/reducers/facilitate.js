import * as actionTypes from '../constants/actionTypes';

export default function vote(state = { facilitate: [] }, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_FACILITATE: {
      const { sessionId, facilitate } = action.payload;
      if(!facilitate && state.facilitate.includes(sessionId)) {
        const facilitate = [...state.facilitate];
        facilitate.splice(facilitate.indexOf(sessionId), 1);
        return { ...state, facilitate };
      } else if(facilitate && !state.facilitate.includes(sessionId)) {
        return { ...state, facilitate: [...state.facilitate, sessionId] };
      } else {
        return state;
      }
    }
    case actionTypes.RECEIVE_FACILITATES: {
      return { ...state, sessions: action.payload.votes };
    }
    default: {
      return state;
    }
  }
}