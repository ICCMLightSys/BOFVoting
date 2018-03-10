import * as actionTypes from '../constants/actionTypes';

const defaultState = {
  slots: [],
  generatingSchedule: false,
};

export default function slot(state = defaultState, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_SLOTS: {
      return { ...state, slots: state.slots.concat(action.payload) };
    }
    case actionTypes.START_GENERATING_SCHEDULE: {
      return { ...state, generatingSchedule: true };
    }
    case actionTypes.FINISH_GENERATING_SCHEDULE: {
      return { ...state, generatingSchedule: false };
    }
    default: {
      return state;
    }
  }
}
