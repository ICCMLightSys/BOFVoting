import configuration from '../configuration';
import * as actionTypes from '../constants/actionTypes';

export function setFacilitate(sessionId, facilitate) {
  return async (dispatch, getState) => {
    const state = getState();
    const conferenceId = state.conference.conferenceId;
    await fetch(`${configuration.baseApiUrl}/conferences/${conferenceId}/sessions/${sessionId}/facilitate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ facilitate })
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      let json = response.json();
      if(response.status === 201) {
        dispatch(receiveFacilitate(json));
      } else {
        dispatch(failSetFacilitate(json.error));
      }
    }).catch((error) => {
      dispatch(failSetFacilitate(error.message));
    });
  }
}

export const receiveFacilitate = ({ sessionId, facilitate }) => {
  return { type: actionTypes.RECEIVE_FACILITATE, payload: { sessionId, facilitate } };
};

export const failSetFacilitate = (error) => {
  return { type: actionTypes.FAIL_SET_FACILITATE, payload: { error } };
};

export const fetchFacilitates = (conferenceId) => {
  return async (dispatch) => {
    const response = await fetch(`${configuration.baseApiUrl}/conferences/${conferenceId}/facilitate`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let json = await response.json();
    if (response.status === 200) {
      dispatch(receiveFacilitates(json));
    } else {
      dispatch(failFetchFacilitates(json.error));
    }
  }
};

const receiveFacilitates = (facilitates) => {
  return { type: actionTypes.RECEIVE_FACILITATES, payload: { facilitates } };
};

export const failFetchFacilitates = (error) => {
  return { type: actionTypes.FAIL_FETCH_FACILITATES, payload: { error } };
};
