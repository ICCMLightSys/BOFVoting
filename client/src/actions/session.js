import configuration from '../configuration';
import * as actionTypes from '../constants/actionTypes';

export function addSession(session) {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    let response = await fetch(`${configuration.baseApiUrl}/conferences/${conferenceId}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ // TODO figure out if stringify is necessary
        name: session.name,
        description: session.description
      })
    });
    let json = await response.json();
    if(response.status === 201) {
      dispatch(receiveSession(json));
    } else {
      dispatch(failAddSession(json.error));
    }
  }
}

export const receiveSession = (session) => {
  return { type: actionTypes.RECEIVE_SESSION, payload: { session } };
};

export const failAddSession = (error) => {
  return { type: actionTypes.FAIL_ADD_SESSION, payload: { error } };
};

export const fetchSessions = (conferenceId) => {
  return async (dispatch) => {
    const response = await fetch(`${configuration.baseApiUrl}/conferences/${conferenceId}/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let json = await response.json();
    if (response.status === 200) {
      dispatch(receiveSessions(json));
    } else {
      dispatch(failFetchSessions(json.error));
    }
  }
};

export const failFetchSessions = (error) => {
  return { type: actionTypes.FAIL_FETCH_SESSIONS, payload: { error } };
};

const receiveSessions = (sessions) => {
  return { type: actionTypes.RECEIVE_SESSIONS, payload: { sessions } };
};
