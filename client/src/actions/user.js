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

export const loginStarted = () => ({
  type: actionTypes.START_LOGIN
});

export const loginFailed = (errorMessage) => ({
  type: actionTypes.FAIL_LOGIN, payload: { errorMessage }
});

export const loginSucceeded = (jwtToken) => ({
  type: actionTypes.LOGIN, payload: { jwtToken }
});

export const login = (username, password) => dispatch => {
  dispatch(loginStarted());

  return request('POST', '/tokens', { username, password })
    .then(({ token }) => dispatch(loginSucceeded(token)))
    .catch((err) => dispatch(loginFailed(err.message)));
};

export const signup = (username, password) => async dispatch => {
  dispatch(loginStarted());

  try {
    await request('POST', '/users', { username, password });
  } catch (e) {
    return dispatch(loginFailed(e.message));
  }

  return dispatch(login(username, password));
};
