import * as actionTypes from '../constants/actionTypes';

export function doSomethingToUser(user) {
  return { type: actionTypes.SOMETHING_DONE_TO_USER, payload: { user } };
}