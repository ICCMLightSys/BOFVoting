import * as actionTypes from '../constants/actionTypes';
import { request } from './request';
import { fetchRooms } from './room';
import { fetchTimes } from './time';
import {fetchConferences} from "./conference";
import {fetchSessions} from "./session";
import {fetchFacilitators} from "./facilitate";
import {fetchUsers} from "./user";

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
    await request(method, route);
    this.props.dispatch(fetchConferences());
    this.props.dispatch(fetchSessions(this.props.conferenceId));
    this.props.dispatch(fetchSlots(this.props.conferenceId));
    this.props.dispatch(fetchFacilitators());
    this.props.dispatch(fetchUsers());
  } catch (error) {
    console.log(error);
  }
};
