import * as actionTypes from '../constants/actionTypes';
import { request } from './request';

export function switchConference(id) {
  return { type: actionTypes.SWITCH_CONFERENCE, payload: { id } };
}

export function fetchConferences() {
  return async (dispatch, getState) => {
    const method = 'GET';
    const route = `/conferences`;
    try {
      const conferences = await request(method, route);
      dispatch(receiveConferences(conferences));
    } catch (error) {
      dispatch(failFetchConferences(error));
    }
  }
}

export const receiveConferences = (conferences) => {
  return { type: actionTypes.RECEIVE_CONFERENCES, payload: { conferences } };
};

export const failFetchConferences = (error) => {
  return { type: actionTypes.FAIL_FETCH_CONFERENCES, payload: { error } };
};


export function setTimes(nominationStartTime, nominationEndTime, votingStartTime, votingEndTime) {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'PATCH';
    const route = `/conferences/${conferenceId}`;
    const data = {
      submissionStart: nominationStartTime,
      submissionEnd: nominationEndTime,
      votingStart: votingStartTime,
      votingEnd: votingEndTime
    };
    try {
      const conference = await request(method, route, data);
      dispatch(receiveConference(conference));
    } catch (error) {
      dispatch(failSetTimes(error));
    }
  }
}

export const receiveConference = (conference) => {
  return { type: actionTypes.RECEIVE_CONFERENCE, payload: { id: conference.id } };
};

export const failSetTimes = (error) => {
  return { type: actionTypes.FAIL_SET_TIMES, payload: { error } };
};

export function patchConference(data) {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    const method = 'PATCH';
    const route = `/conferences/${conferenceId}`;
    try {
      const conference = await request(method, route, data);
      dispatch(receiveConference(conference));
    } catch (error) {
      dispatch(failPatchConference(error));
    }
  }
}

export const failPatchConference = (error) => {
  return { type: actionTypes.FAIL_PATCH_CONFERENCE, payload: { error } };
};