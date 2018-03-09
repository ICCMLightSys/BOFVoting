import * as actionTypes from '../constants/actionTypes';
import { request } from './request';

export const fetchUsers = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'GET';
    const route = `/conferences/${conferenceId}/users`;
    try {
      const response = await request(method, route);
      dispatch(receiveUsers(response));
    } catch (error) {
      dispatch(failFetchUsers(error));
    }
  }
};

const receiveUsers = (users) => {
  return { type: actionTypes.RECEIVE_USERS, payload: { users } };
};

export const failFetchUsers = (error) => {
  return { type: actionTypes.FAIL_FETCH_USERS, payload: { error } };
};
