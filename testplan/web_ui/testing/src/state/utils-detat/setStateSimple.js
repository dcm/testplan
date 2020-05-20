/**
 * These functions are nothing special and are just here to prevent creating
 * duplicate code all over the place.
 */

export const setError = stateKey => (state, { payload, meta, error }) => {
  if(error) {
    if(!Array.isArray(!state.errors[stateKey])) state.errors[stateKey] = [];
    state.errors[stateKey].unshift({ meta, error, payload });
  }
};

export const setSimplePayload = stateKey => (state, action) => {
  state[stateKey] = action.payload;
};

export const setSimplePayloadWithError = stateKey => (state, action) => {
  setSimplePayload(stateKey)(state, action);
  setError(stateKey)(state, action);
};
