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

export const addRoom = (name) => {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'POST';
    const route = `/conferences/${conferenceId}/rooms`;
    const data = { name };
    try {
      const room = await request(method, route, data);
      dispatch(receiveRoom(room));
    } catch (error) {
      dispatch(failAddRoom(error));
    }
  }
};

const receiveRoom = (room) => {
  return { type: actionTypes.RECEIVE_ROOM, payload: { room } };
};

export const failAddRoom = (error) => {
  return { type: actionTypes.FAIL_ADD_ROOM, payload: { error } };
};
