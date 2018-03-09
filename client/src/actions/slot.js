import * as actionTypes from '../constants/actionTypes';
import { request } from './request';
import { fetchRooms } from './room';
import { fetchTimes } from './time';

export const fetchSlots = (conferenceId) => {
  return async (dispatch) => {
    const method = 'GET';
    const route = `/conferences/${conferenceId}/slots`;
    try {
      const response = await request(method, route);
      dispatch(fetchRooms(conferenceId));
      dispatch(fetchTimes(conferenceId));
      dispatch(receiveSlots(response));
    } catch (error) {
      dispatch(failFetchSlots(error));
    }
  }
};
export const failFetchSlots = (error) => {
  return { type: actionTypes.FAIL_FETCH_SLOTS, payload: { error } };
};

const receiveSlots = (slots) => {
  return { type: actionTypes.RECEIVE_SLOTS, payload: slots };
};

export const generateSchedule = () => async (dispatch, getState) => {
  const state = getState();
  const conferenceId = state.conference.conferenceId;
  const method = 'POST';
  const route = `/conferences/${conferenceId}/generateSchedule`;
  try {
    const response = await request(method, route);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
