import URLParamRegistry from '../Common/URLParamRegistry';
import { appHistory } from './AppRouter';
import { setIsDevel } from './appActions';
import { setIsTesting } from './appActions';
import { setSkipFetch } from './appActions';

export default new URLParamRegistry(appHistory)
  .registerBidirectionalListener('isDevel', setIsDevel)
  .registerBidirectionalListener('isTesting', setIsTesting)
  .registerBidirectionalListener('skipFetch', setSkipFetch)
  .createMiddleware();
