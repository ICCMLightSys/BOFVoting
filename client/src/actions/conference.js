import * as actionTypes from '../constants/actionTypes';
import { request } from './request';

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
