import { appHistory } from './AppRouter';
import appSlice from './appSlice';
import URLParamRegistry from './utils-detat/URLParamRegistry';

const appParamRegistry = new URLParamRegistry(appHistory);
appParamRegistry.registerBidirectionalListener(
  'isDevel',
  appSlice.actions.setIsDevel
);
appParamRegistry.registerBidirectionalListener(
  'isTesting',
  appSlice.actions.setIsTesting
);

export default appParamRegistry.createMiddleware();
