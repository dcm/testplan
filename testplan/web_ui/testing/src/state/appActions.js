import appSlice from './appSlice';
import { appRouterActions } from './AppRouter';

export { setIsDevel } from './AppRouter';
export { setIsTesting } from './AppRouter';

export const {
  push: appRouterPush,
  replace: appRouterReplace,
  go: appRouterGo,
  goBack: appRouterGoBack,
  goForward: appRouterGoForward,
} = appRouterActions;

export const {  // eslint-disable-line no-empty-pattern

} = appSlice.actions;
