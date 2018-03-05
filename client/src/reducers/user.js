import * as actionTypes from '../constants/actionTypes';

export default function user(state = { count: 0 }, action) {
  switch(action.type) {
    case actionTypes.SOMETHING_DONE_TO_USER: {
      return { ...state, count: state.count + 1 };
    }
    default: {
      return state;
    }
  }
}
