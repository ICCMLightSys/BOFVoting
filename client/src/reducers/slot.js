import * as actionTypes from '../constants/actionTypes';

const defaultState = {
  //defaultState?
};

export default function slot(state = defaultState, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_SLOTS: {
      return { ...state, slots: action.payload };
    }
    default: {
      return state;
    }
  }
}
