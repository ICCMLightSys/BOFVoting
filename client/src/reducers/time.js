import * as actionTypes from '../constants/actionTypes';

const defaultState = {
  //defaultState?
};

export default function time(state = defaultState, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_TIMES: {
      return { ...state, times: action.payload };
    }
    default: {
      return state;
    }
  }
}
