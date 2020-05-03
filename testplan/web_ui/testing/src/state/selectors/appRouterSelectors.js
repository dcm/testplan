import createSelectors from 'connected-react-router/esm/selectors';
import immerStructure from '../struct/immerStructure';

export const {
  getLocation: getAppRouterLocation,
  getAction: getAppRouterAction,
  getHash: getAppRouterHash,
  getSearch: getAppRouterSearch,
  createMatchSelector: createAppRouterMatchSelector,
} = createSelectors(immerStructure);
