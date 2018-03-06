import * as actionTypes from '../constants/actionTypes';
import { request } from './request';

export const setFacilitate = (sessionId, facilitate) => {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'POST';
    const route = `/conferences/${conferenceId}/sessions/${sessionId}/facilitate`;
    const data = { facilitate };
    try {
      const response = await request(method, route, data);
      dispatch(receiveFacilitate({ ...response, sessionId }));
    } catch (error) {
      dispatch(failSetFacilitate(error));
    }
  }
};

export const receiveFacilitate = ({ sessionId, facilitate }) => {
  return { type: actionTypes.RECEIVE_FACILITATE, payload: { sessionId, facilitate } };
};

export const failSetFacilitate = (error) => {
  return { type: actionTypes.FAIL_SET_FACILITATE, payload: { error } };
};

export const fetchFacilitates = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'GET';
    const route = `/conferences/${conferenceId}/facilitate`;
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
