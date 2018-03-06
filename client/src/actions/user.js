import * as actionTypes from '../constants/actionTypes';

const defaultState = {
  userId: 1,
};

export default function user(state = defaultState, action) {
  switch(action.type) {
    default: {
      return state;
    }
  }
}
