import * as actionTypes from '../constants/actionTypes';

const defaultState = {
  id: 1, // TODO don't hardcode user ID
  jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRhdmlkIiwidXNlcklkIjoxLCJzaWduZWRJbiI6dHJ1ZSwiaWF0IjoxNTIwNTcwODUxfQ.qHMQMm8sMlzE0Da-kRTMN4XV1QS8nWsa6nqQjoQvtns',
  users: []
};

export default function user(state = defaultState, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_USERS: {
      return { ...state, users: action.payload.users };
    }
    default: {
      return state;
    }
  }
}
