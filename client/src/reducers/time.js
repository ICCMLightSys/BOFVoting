import * as actionTypes from '../constants/actionTypes';

const defaultState = [];

export default function time(state = defaultState, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_TIMES: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
