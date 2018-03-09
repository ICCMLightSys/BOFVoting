import * as actionTypes from '../constants/actionTypes';

const defaultState = {
  //defaultState?
};

export default function room(state = defaultState, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_ROOMS: {
      return { ...state, rooms: action.payload };
    }
    default: {
      return state;
    }
  }
}
