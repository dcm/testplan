import URLParamRegistry from '../../../Common/URLParamRegistry';
import { uiHistory } from './UIRouter';
import { setShowTags } from './uiActions';
import { setShowInfoModal } from './uiActions';
import { setDoAutoSelect } from './uiActions';
import { setFilter } from './uiActions';
import { setDisplayEmpty } from './uiActions';
import { setShowHelpModal } from './uiActions';

export default new URLParamRegistry(uiHistory)
  .registerBidirectionalListener('showTags', setShowTags)
  .registerBidirectionalListener('showInfoModal', setShowInfoModal)
  .registerBidirectionalListener('doAutoSelect', setDoAutoSelect)
  .registerBidirectionalListener('filter', setFilter)
  .registerBidirectionalListener('displayEmpty', setDisplayEmpty)
  .registerBidirectionalListener('showHelpModal', setShowHelpModal)
  .createMiddleware();
