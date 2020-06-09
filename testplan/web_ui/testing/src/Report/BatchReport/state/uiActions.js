import uiSlice from './uiSlice';
import { uiRouterActions } from './UIRouter';

export { setShowTags } from './UIRouter';
export { setShowInfoModal } from './UIRouter';
export { setDoAutoSelect } from './UIRouter';
export { setFilter } from './UIRouter';
export { setDisplayEmpty } from './UIRouter';
export { setShowHelpModal } from './UIRouter';

export const {
  push: uiRouterPush,
  replace: uiRouterReplace,
  go: uiRouterGo,
  goBack: uiRouterGoBack,
  goForward: uiRouterGoForward,
} = uiRouterActions;

export const {
  setHashComponentAlias,
  unsetHashComponentAliasByAlias,
  unsetHashComponentAliasByComponent,
  setSelectedTestCase,
} = uiSlice.actions;
