import * as actionTypes from '../constants/actionTypes';

const defaultState = {
  conferenceId: 1, // TODO don't hardcode conference ID
};

export default function conference(state = defaultState, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_CONFERENCE: {
      return action.payload.conference.id;
    }
    default: {
      return state;
    }
  }
}
