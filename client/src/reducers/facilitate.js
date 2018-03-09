import * as actionTypes from '../constants/actionTypes';

const defaultState = { facilitate: {}, facilitators: [], facilitateStatus: {} };

export default function vote(state = defaultState, action) {
  switch(action.type) {
    case actionTypes.SET_FACILITATE: {
      const { sessionId, facilitate } = action.payload;
      return {
        ...state,
        facilitate: { ...state.facilitate, [sessionId]: facilitate },
        facilitateStatus: { ...state.facilitateStatus, [sessionId]: { writing: true, error: null} },
      };
    }
    case actionTypes.SET_FACILITATE_COMPLETE: {
      const sessionId = action.payload;
      return { ...state, facilitateStatus: { ...state.facilitateStatus, [sessionId]: { writing: false, error: null } } };
    }
    case actionTypes.SET_FACILITATE_FAILED: {
      const { sessionId } = action.payload;
      return { ...state, facilitateStatus: { ...state.facilitateStatus, [sessionId]: { writing: false, error: action.error } } };
    }
    case actionTypes.RECEIVE_FACILITATES: {
      const newFacilitate = { ...state.facilitate };
      Object.keys(newFacilitate).forEach(key => newFacilitate[key] = false);
      action.payload.facilitates.forEach(sessionId => newFacilitate[sessionId] = true);
      return { ...state, facilitate: newFacilitate };
    }
    case actionTypes.RECEIVE_FACILITATORS: {
      return { ...state, facilitators: action.payload.facilitators };
    }
    case actionTypes.RECEIVE_FACILITATE_ADMIN: {
      // const { sessionId, userId, facilitate } = action.payload;
      // const sessionData = state.facilitators.find(session => session.id === sessionId);
      // if(!facilitate && sessionData.facilitators.includes(userId)) {
      //   const newSessionData = { ...sessionData, facilitators: [...sessionData.facilitators] };
      //   newSessionData.splice()
      // }
      return state;
    }
    case actionTypes.LOGOUT: {
      return defaultState;
    }
    default: {
      return state;
    }
  }
}
