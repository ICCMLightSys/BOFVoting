import * as actionTypes from '../constants/actionTypes';

export default function vote(state = { votes: {} }, action) {
  switch(action.type) {
    case actionTypes.RECEIVE_VOTE: {
      const { sessionId, voteType } = action.payload;
      return { ...state, votes: { ...state.votes, [sessionId]: voteType.toUpperCase() } };
    }
    case actionTypes.RECEIVE_VOTES: {
      const votes = {};
      action.payload.votes.forEach(({ sessionId, voteType }) => {
        votes[sessionId] = voteType;
      });
      return { ...state, votes };
    }
    default: {
      return state;
    }
  }
}
