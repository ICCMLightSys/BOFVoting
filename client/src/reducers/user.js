const defaultState = {
  userId: 1, // TODO don't hardcode user ID
};

export default function user(state = defaultState, action) {
  switch(action.type) {
    default: {
      return state;
    }
  }
}
