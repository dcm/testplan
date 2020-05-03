import plainStructure from 'connected-react-router/esm/structure/plain';

// immer needs the state "mutated" directly
export default {
  ...plainStructure,
  merge(draftState, payload) {
    Object.assign(draftState, payload);
  },
};
