import configuration from '../configuration';
import * as actionTypes from '../constants/actionTypes';

export function setVote(sessionId, voteType) {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    await fetch(`${configuration.baseApiUrl}/conferences/${conferenceId}/sessions/${sessionId}/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ voteType })
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      let json = response.json();
      if(response.status === 201) {
        dispatch(receiveVote(json));
      } else {
        dispatch(failSetVote(json.error));
      }
    }).catch((error) => {
      dispatch(failSetVote(error.message));
    });
  }
}

export const receiveVote = (vote) => {
  return { type: actionTypes.RECEIVE_VOTE, payload: { vote } };
};

export const failSetVote = (error) => {
  return { type: actionTypes.FAIL_SET_VOTE, payload: { error } };
};

export const fetchVotes = (conferenceId) => {
  return async (dispatch) => {
    await fetch(`${configuration.baseApiUrl}/conferences/${conferenceId}/votes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      let json = response.json();
      if (response.status === 200) {
        dispatch(receiveVotes(json));
      } else {
        dispatch(failFetchVotes(json.error));
      }
    }).catch((error) => {
      dispatch(failSetVote(error.message));
    });
  }
};

const receiveVotes = (votes) => {
  return { type: actionTypes.RECEIVE_VOTES, payload: { votes } };
};

export const failFetchVotes = (error) => {
  return { type: actionTypes.FAIL_FETCH_VOTES, payload: { error } };
};
