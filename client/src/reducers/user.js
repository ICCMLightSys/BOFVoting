const defaultState = {
  userId: 1, // TODO don't hardcode user ID
  jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRhdmlkIiwidXNlcklkIjoxLCJzaWduZWRJbiI6dHJ1ZSwiaWF0IjoxNTIwMzYwMjI5fQ.uF4J3V0QXs-LZ15HzROQ5p531A8eQSXzbNdEl0uwQQY',
};

export default function user(state = defaultState, action) {
  switch(action.type) {
    default: {
      return state;
    }
  }
}
