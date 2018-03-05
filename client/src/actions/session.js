import * as actionTypes from '../constants/actionTypes';
import configuration from '../configuration';
import { RECEIVE_SESSIONS } from '../constants/actionTypes';

// export const REQUEST_POSTS = 'REQUEST_POSTS'
// function requestPosts(subreddit) {
//     return {
//         type: REQUEST_POSTS,
//         subreddit
//     }
// }
// ​
// export const RECEIVE_POSTS = 'RECEIVE_POSTS'
// function receivePosts(subreddit, json) {
//     return {
//         type: RECEIVE_POSTS,
//         subreddit,
//         posts: json.data.children.map(child => child.data),
//         receivedAt: Date.now()
//     }
// }
// ​
// export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
// export function invalidateSubreddit(subreddit) {
//     return {
//         type: INVALIDATE_SUBREDDIT,
//         subreddit
//     }
// }

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
​
// function shouldFetchPosts(state, subreddit) {
//   const posts = state.postsBySubreddit[subreddit]
//   if (!posts) {
//       return true
//   } else if (posts.isFetching) {
//       return false
//   } else {
//       return posts.didInvalidate
//   }
// }
​
// export function fetchPostsIfNeeded(subreddit) {
//     // Note that the function also receives getState()
//     // which lets you choose what to dispatch next.
// ​
//     // This is useful for avoiding a network request if
//     // a cached value is already available.
// ​
//   return (dispatch, getState) => {
//       if (shouldFetchPosts(getState(), subreddit)) {
//           // Dispatch a thunk from thunk!
//           return dispatch(fetchPosts(subreddit))
//       } else {
//           // Let the calling code know there's nothing to wait for.
//           return Promise.resolve()
//       }
//   }
// }
