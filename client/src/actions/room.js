import * as actionTypes from '../constants/actionTypes';
import { request } from './request';

export const fetchRooms = (conferenceId) => {
  return async (dispatch) => {
    const method = 'GET';
    const route = `/conferences/${conferenceId}/rooms`;
    try {
      const response = await request(method, route);
      dispatch(receiveRooms(response));
    } catch (error) {
      dispatch(failFetchRooms(error));
    }
  }
};
export const failFetchRooms = (error) => {
  return { type: actionTypes.FAIL_FETCH_ROOMS, payload: { error } };
};

const receiveRooms = (rooms) => {
  return { type: actionTypes.RECEIVE_ROOMS, payload: rooms };
};
