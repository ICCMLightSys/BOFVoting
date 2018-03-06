import * as actionTypes from '../constants/actionTypes';

export default function vote(state = { votes: {} }, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_VOTE: {
      const { sessionId, voteType } = action.payload.vote;
      return { ...state, votes: { ...state.votes, [sessionId]: voteType } };
    }
    case actionTypes.RECEIVE_VOTES: {
      return { ...state, sessions: action.payload.votes };
    }
    default: {
      return state;
    }
  }
}
