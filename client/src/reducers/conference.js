import * as actionTypes from '../constants/actionTypes';

const defaultState = {
  conferenceId: 1, // TODO don't hardcode conference ID
  conferences: [],
};

export default function conference(state = defaultState, action) {
  switch(action.type) {
    case actionTypes.SWITCH_CONFERENCE: {
      return { ...state, conferenceId: action.payload.id };
    }
    case actionTypes.RECEIVE_CONFERENCES: {
      return { ...state, conferences: action.payload.conferences };
    }
    case actionTypes.RECEIVE_CONFERENCE: {
      return { ...state, conferenceId: action.payload.conference.id };
    }
    case actionTypes.LOGOUT: {
      return defaultState;
    }
    default: {
      return state;
    }
  }
}
