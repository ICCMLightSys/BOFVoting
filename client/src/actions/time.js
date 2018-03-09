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
