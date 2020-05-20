import { mapToQueryString, queryStringToMap } from '../../../Common/utils';

/**
 * Simply adds a `param=val` to a search string.
 * @example
 > const sStr = '?a=1&b=2';
 > createNewSearchString('c', false, sStr)
 '?a=1&b=2&c=false'
 *
 * @param {string} param
 * @param {any} val
 * @param {string} [searchString=""]
 * @returns {string}
 */
export default function createNewSearchString(param, val, searchString = '') {
  const transitionSearchMap = queryStringToMap(searchString);
  transitionSearchMap.set(param, val);
  return mapToQueryString(transitionSearchMap);
};
