import configuration from '../configuration';

export function addSession(singer, session) {
  return async dispatch => {
    let response = await fetch(config.baseApiUrl + '/organizations/' + orgId + '/singers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ // TODO figure out if stringify is necessary
        name: session.name,
        description: session.description
      })
    });
    let json = await response.json();
    if(response.status === 201) {
      dispatch(receiveSession(json));
    } else {
      dispatch(failAddSession(json.error));
    }
  }
}

export const receiveSession = (session) => {
  return { type: actionTypes.RECEIVE_SESSION, payload: { session }};
};

export const failAddSession = (error) => {
  return { type: actionTypes.FAIL_ADD_SESSION, payload: { error }};
};

export const fetchSessions = (conferenceId) => {
  return async (dispatch) => {
    const response = await fetch(`${configuration.baseApiUrl}/conferences/${conferenceId}/sessions`);
    if (response.status === 200) {
      dispatch(receiveSessions(response));
    } else {
      dispatch(failFetchSessions());
    }
  }
};

const failFetchSessions = () => {
  return { type: actionTypes.FAIL_FETCH_SESSIONS, payload: { error }};
};
​
const receiveSessions = (sessions) => {
  return {
    type: RECEIVE_SESSIONS,
    payload: { sessions },
  };
};
