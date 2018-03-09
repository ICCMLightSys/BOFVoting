import * as actionTypes from '../constants/actionTypes';

export default function vote(state = { votes: {}, voteStatus: {} }, action) {
  switch(action.type) {
    case actionTypes.SET_VOTE: {
      const { sessionId, voteType } = action.payload;
      return {
        ...state,
        votes: { ...state.votes, [sessionId]: voteType.toUpperCase() },
        voteStatus: { ...state.voteStatus, [sessionId]: { writing: true, error: null} },
      };
    }
    case actionTypes.SET_VOTE_COMPLETE: {
      const sessionId = action.payload;
      return { ...state, voteStatus: { ...state.voteStatus, [sessionId]: { writing: false, error: null } } };
    }
    case actionTypes.SET_VOTE_FAILED: {
      const { sessionId } = action.payload;
      return { ...state, voteStatus: { ...state.voteStatus, [sessionId]: { writing: false, error: action.error } } };
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
