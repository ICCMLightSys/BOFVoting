import * as actionTypes from '../constants/actionTypes';

const defaultState = [];

export default function room(state = defaultState, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_ROOMS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
