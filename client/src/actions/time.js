import * as actionTypes from '../constants/actionTypes';
import { request } from './request';

export const fetchTimes = (conferenceId) => {
  return async (dispatch) => {
    const method = 'GET';
    const route = `/conferences/${conferenceId}/times`;
    try {
      const response = await request(method, route);
      dispatch(receiveTimes(response));
    } catch (error) {
      dispatch(failFetchTimes(error));
    }
  }
};
export const failFetchTimes = (error) => {
  return { type: actionTypes.FAIL_FETCH_TIMES, payload: { error } };
};

const receiveTimes = (times) => {
  return { type: actionTypes.RECEIVE_TIMES, payload: times };
};

export const addTime = (name, idx) => {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'POST';
    const route = `/conferences/${conferenceId}/times`;
    const data = { name, idx };
    try {
      const time = await request(method, route, data);
      dispatch(receiveTime(time));
    } catch (error) {
      dispatch(failAddTime(error));
    }
  }
};

const receiveTime = (time) => {
  return { type: actionTypes.RECEIVE_TIME, payload: { time } };
};

export const failAddTime = (error) => {
  return { type: actionTypes.FAIL_ADD_TIME, payload: { error } };
};
