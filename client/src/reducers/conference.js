const defaultState = {
  conferenceId: 1, // TODO don't hardcode conference ID
};

export default function conference(state = defaultState, action) {
  switch(action.type) {
    default: {
      return state;
    }
  }
}
