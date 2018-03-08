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
      dispatch(receiveNewSession(response));
    } catch (error) {
      dispatch(failAddSession(error));
    }
  }
}

export const receiveNewSession = (session) => {
  return { type: actionTypes.RECEIVE_NEW_SESSION, payload: { session } };
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

export function updateSession(session) {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'PATCH';
    const route = `/conferences/${conferenceId}/sessions/${session.id}`;
    const data = { name: session.name, description: session.description };
    try {
      const response = await request(method, route, data);
      dispatch(receiveUpdatedSession(response));
    } catch (error) {
      dispatch(failUpdateSession(error));
    }
  }
}

export const receiveUpdatedSession = (session) => {
  return { type: actionTypes.RECEIVE_UPDATED_SESSION, payload: { session } };
};

export const failUpdateSession = (error) => {
  return { type: actionTypes.FAIL_UPDATE_SESSION, payload: { error } };
};

export function deleteSession(id) {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'DELETE';
    const route = `/conferences/${conferenceId}/sessions/${id}`;
    try {
      await request(method, route);
      dispatch(receiveDeletedSession(id));
    } catch (error) {
      dispatch(failDeleteSession(error));
    }
  }
}

export const receiveDeletedSession = (id) => {
  return { type: actionTypes.RECEIVE_DELETED_SESSION, payload: { id } };
};

export const failDeleteSession = (error) => {
  return { type: actionTypes.FAIL_DELETE_SESSION, payload: { error } };
};
