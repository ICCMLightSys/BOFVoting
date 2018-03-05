import configuration from '../configuration';
import { RECEIVE_SESSIONS } from '../constants/actionTypes';

export const fetchSessions = (conferenceId) => {
  return async (dispatch) => {
    const response = await fetch(`${configuration.baseApiUrl}/conferences/${conferenceId}/sessions`);
    if (response.status === 200) dispatch(receiveSessions(response));
    else dispatch(failFetchingSessions());
  }
};

const failFetchingSessions = () => {
  console.log('Fail');
};
​
const receiveSessions = (sessions) => {
  return {
    type: RECEIVE_SESSIONS,
    payload: { sessions },
  },
};
