import { BEGIN, COMMIT, REVERT } from 'redux-optimist';
import { request } from '../actions/request';
import * as actionTypes from '../constants/actionTypes';

let nextTransactionID = 0;
export default function () {
  return next => action => {
    switch(action.type) {
      case actionTypes.SET_VOTE: {
        let transactionId = nextTransactionID++;
        next({
          type: actionTypes.SET_VOTE,
          payload: action.payload,
          optimist: { type: BEGIN, id: transactionId }
        });
        const method = 'POST';
        const route = `/sessions/${action.payload.sessionId}/votes`;
        const data = { voteType: action.payload.voteType };
        request(method, route, data).then((response) => {
          next({
            type: actionTypes.SET_VOTE_COMPLETE,
            payload: action.payload,
            response: response,
            optimist: { type: COMMIT, id: transactionId },
          })
        }).catch((error) => {
          next({
            type: actionTypes.SET_VOTE_FAILED,
            payload: action.payload,
            error: error,
            optimist: { type: REVERT, id: transactionId },
          })
        });
        break;
      }
      case actionTypes.SET_FACILITATE: {
        let transactionId = nextTransactionID++;
        next({
          type: actionTypes.SET_FACILITATE,
          payload: action.payload,
          optimist: { type: BEGIN, id: transactionId }
        });
        const method = 'POST';
        const route = `/sessions/${action.payload.sessionId}/facilitate`;
        const data = { facilitate: action.payload.facilitate };
        request(method, route, data).then((response) => {
          next({
            type: actionTypes.SET_FACILITATE_COMPLETE,
            payload: action.payload,
            response: response,
            optimist: { type: COMMIT, id: transactionId },
          })
        }).catch((error) => {
          next({
            type: actionTypes.SET_FACILITATE_FAILED,
            payload: action.payload,
            error: error,
            optimist: { type: REVERT, id: transactionId },
          })
        });
        break;
      }
      default: {
        return next(action);
      }
    }
  }
}
