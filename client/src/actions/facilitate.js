import * as actionTypes from '../constants/actionTypes';
import { request } from './request';

export const setFacilitate = (sessionId, facilitate) => {
  return { type: actionTypes.SET_FACILITATE, payload: { sessionId, facilitate } };
};

export const fetchFacilitates = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'GET';
    const route = `/conferences/${conferenceId}/sessions/facilitators`;
    try {
      const response = await request(method, route);
      dispatch(receiveFacilitates(response));
    } catch (error) {
      dispatch(failFetchFacilitates(error));
    }
  }
};

const receiveFacilitates = (facilitates) => {
  return { type: actionTypes.RECEIVE_FACILITATES, payload: { facilitates } };
};

export const failFetchFacilitates = (error) => {
  return { type: actionTypes.FAIL_FETCH_FACILITATES, payload: { error } };
};

export const fetchFacilitators = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'GET';
    const route = `/conferences/${conferenceId}/facilitators`;
    try {
      const response = await request(method, route);
      dispatch(receiveFacilitators(response));
    } catch (error) {
      dispatch(failFetchFacilitators(error));
    }
  }
};

const receiveFacilitators = (facilitators) => {
  return { type: actionTypes.RECEIVE_FACILITATORS, payload: { facilitators } };
};

export const failFetchFacilitators = (error) => {
  return { type: actionTypes.FAIL_FETCH_FACILITATORS, payload: { error } };
};

export const setFacilitateAdmin = (sessionId, userId, facilitate) => {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'POST';
    const route = `/conferences/${conferenceId}/sessions/${sessionId}/facilitate`;
    const data = { userId, facilitate };
    try {
      const response = await request(method, route, data);
      dispatch(receiveFacilitateAdmin({ ...response, sessionId }));
    } catch (error) {
      dispatch(failSetFacilitateAdmin(error));
    }
  }
};

export const receiveFacilitateAdmin = ({ sessionId, userId, facilitate }) => {
  return { type: actionTypes.RECEIVE_FACILITATE_ADMIN, payload: { sessionId, userId, facilitate } };
};

export const failSetFacilitateAdmin = (error) => {
  return { type: actionTypes.FAIL_SET_FACILITATE_ADMIN, payload: { error } };
};