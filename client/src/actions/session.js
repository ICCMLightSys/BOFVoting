import * as actionTypes from '../constants/actionTypes';
import { request } from './request';

export function addSession(session) {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'POST';
    const route = `/conferences/${conferenceId}/sessions`;
    const data = { name: session.name, description: session.description };
    try {
      const response = await request(method, route, data);
      dispatch(receiveSession(response));
    } catch (error) {
      dispatch(failAddSession(error));
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
    const method = 'GET';
    const route = `/conferences/${conferenceId}/sessions`;
    try {
      const response = await request(method, route);
      dispatch(receiveSessions(response));
    } catch (error) {
      dispatch(failFetchSessions(error));
    }
  }
};

export const failFetchSessions = (error) => {
  return { type: actionTypes.FAIL_FETCH_SESSIONS, payload: { error } };
};

const receiveSessions = (sessions) => {
  return { type: actionTypes.RECEIVE_SESSIONS, payload: { sessions } };
};
