import * as actionTypes from '../constants/actionTypes';
import { request } from './request';

export function setVote(sessionId, voteType) {
  const payload = { sessionId, voteType: voteType.substring(0, 1).toUpperCase() + voteType.substring(1).toLowerCase() };
  return { type: actionTypes.SET_VOTE, payload: payload };
}

export const fetchVotes = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'GET';
    const route = `/conferences/${conferenceId}/votes`;
    try {
      const response = (await request(method, route))
        .map(({ sessionId, voteType }) => ({ sessionId, voteType: voteType.toUpperCase() }));
      dispatch(receiveVotes(response));
    } catch (error) {
      dispatch(failFetchVotes(error));
    }
  }
};

const receiveVotes = (votes) => {
  return { type: actionTypes.RECEIVE_VOTES, payload: { votes } };
};

export const failFetchVotes = (error) => {
  return { type: actionTypes.FAIL_FETCH_VOTES, payload: { error } };
};
