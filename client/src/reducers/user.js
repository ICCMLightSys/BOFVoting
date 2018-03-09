import * as actionTypes from '../constants/actionTypes';

const defaultState = {
  jwtToken: null,
  loginRunning: false,
  loginError: null,
  users: []
};

export default function user(state = defaultState, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_USERS: {
      return { ...state, users: action.payload.users };
    }

    case actionTypes.START_LOGIN: {
      return { ...state, loginRunning: true };
    }

    case actionTypes.LOGIN: {
      return { ...state, jwtToken: action.payload.jwtToken, loginRunning: false, loginError: null };
    }

    case actionTypes.FAIL_LOGIN: {
      return { ...state, loginRunning: false, loginError: action.payload.errorMessage };
    }

    case actionTypes.LOGOUT: {
      return defaultState;
    }

    default: {
      return state;
    }
  }
}
