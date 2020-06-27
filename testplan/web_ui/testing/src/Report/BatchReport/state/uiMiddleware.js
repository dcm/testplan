import URLParamRegistry from '../../../state/utils-detat/URLParamRegistry';
import { uiHistory } from './UIRouter';
import uiSlice from './uiSlice';

const uiParamRegistry = new URLParamRegistry(uiHistory);
uiParamRegistry.registerBidirectionalListener(
  'showTags',
  uiSlice.actions.setShowTags
);
uiParamRegistry.registerBidirectionalListener(
  'showInfoModal',
  uiSlice.actions.setShowInfoModal
);
uiParamRegistry.registerBidirectionalListener(
  'doAutoSelect',
  uiSlice.actions.setDoAutoSelect
);
uiParamRegistry.registerBidirectionalListener(
  'filter',
  uiSlice.actions.setFilter
);
uiParamRegistry.registerBidirectionalListener(
  'displayEmpty',
  uiSlice.actions.setDisplayEmpty
);
uiParamRegistry.registerBidirectionalListener(
  'showHelpModal',
  uiSlice.actions.setShowHelpModal
);

export default uiParamRegistry.createMiddleware();
