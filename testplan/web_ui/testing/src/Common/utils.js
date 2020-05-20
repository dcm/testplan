/* global globalThis */
/**
 * Common utility functions.
 */
import { NAV_ENTRY_DISPLAY_DATA } from "./defaults";

/**
 * Get the data to be used when displaying the nav entry.
 *
 * @param {object} entry - nav entry.
 * @returns {Object}
 */
export function getNavEntryDisplayData(entry) {
  const metadata = {};
  for (const attribute of NAV_ENTRY_DISPLAY_DATA) {
    if (entry.hasOwnProperty(attribute)) {
      metadata[attribute] = entry[attribute];
    }
  }
  return metadata;
}

/**
 * Returns true of any element of an iterable is true. If not, returns false.
 *
 * @param iterable
 * @returns {boolean}
 */
export const any = iterable => Array.from(iterable).some(e => !!e);

/**
 * Returns a sorted array of the given iterable.
 *
 * @param iterable
 * @param {function} key - function that serves as a key for the sort comparison
 * @param {boolean} reverse - if true, the sorted list is reversed
 * @returns {Array}
 */
export function sorted(iterable, key=(item) => (item), reverse=false) {
  return iterable.sort((firstMember, secondMember) => {
    const reverser = reverse ? 1 : -1;

    return ((key(firstMember) < key(secondMember))
      ? reverser
      : ((key(firstMember) > key(secondMember))
        ? (reverser * -1)
        : 0));
  });
}

/**
 * Creates a string that can be used for dynamic id attributes
 * Example: "id-so7567s1pcpojemi"
 * @returns {string}
 */
export function uniqueId() {
  return 'id-' + Math.random().toString(36).substr(2, 16);
}

/**
 * Generate a hash code by string
 * @param {string} str - string that generate hash code
 * @returns {number}
 */
export function hashCode(str) {
  let hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Get the string representation of a HTML DOM node
 * @param {object} dom - HTML DOM node
 * @returns {string}
 */
export function domToString(dom) {
  const tmp = document.createElement("div");
  tmp.appendChild(dom);
  return tmp.innerHTML;
}

/**
 * @desc
 * Repeatedly calls
 * [Array.flat]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat}
 * on an array until it is a depth-1 array.
 * @example
 * flatten([[1],[[[[2,[3]]]]]]) === [ 1, 2, 3 ]
 * @param {Array} it
 * @returns {Array}
 */
export const flatten = it =>
  Array.isArray(it) ? it.flatMap(e => flatten(e)) : it;

/**
 * Returns the single value from an array containing one element, else just
 * returns the array.
 * @template T
 * @param {Array<T>} arr
 * @returns {T | Array<T>}
 */
export const singletonToValue = arr =>
  Array.isArray(arr) && arr.length === 1 ? arr[0] : arr;

/**
 * Convert a URL query string to a generator of [ key, JSON.parse'd value ].
 * @example
 * queryStringToMap('?a=1&b=true&c=%7B"x"%3A+null%7D') === new Map([
 *   ['a', 1],
 *   ['b', true],
 *   ['c', { x: null }],
 * ])
 * @param {string} queryString - a URL query string
 * @yields {[string, any]}
 */
export function *queryStringToEntriesGenerator(queryString) {
  for(const [ qKey, qVal ] of new URLSearchParams(queryString).entries()) {
    let entry;
    try {
      entry = [ qKey, JSON.parse(qVal) ];
    } catch(err) {
      entry = [ qKey, qVal ];
    }
    yield entry;
  }
}

/**
 * Convert a URL query string to a Map with JSON.parse'd values
 * @example
 * queryStringToMap('?a=1&b=true&c=%7B"x"%3A+null%7D') === new Map([
 *   ['a', 1],
 *   ['b', true],
 *   ['c', { x: null }],
 * ])
 * @param {string} queryString - a URL query string
 * @returns {Map<string, any>}
 */
export const queryStringToMap = (queryString) =>
  // @ts-ignore
  new Map(queryStringToEntriesGenerator(queryString));

/** @typedef {any |string |number |boolean |null |symbol |BigInt} ActuallyAny */
/**
 * Convert a URL query string to a JSON-parsed object
 * @example
 * mapToQueryString(new Map([
 *   ['a', 1],
 *   ['b', true],
 *   ['c', { x: null }],
 * ])) === '?a=1&b=true&c=%7B"x"%3A+null%7D'
 * @param {Map<string, ActuallyAny>} mapObj - a Map
 * @returns {string}
 */
export function mapToQueryString(mapObj) {
  const stringifiedEntries = [];
  for(const [ oKey, oVal ] of mapObj) {
    stringifiedEntries.push([
      oKey,
      typeof oVal === 'string' ? oVal : JSON.stringify(oVal),
    ]);
  }
  return new URLSearchParams(stringifiedEntries).toString();
}

export const objToQueryString = plainObj =>
  mapToQueryString(new Map(Object.entries(plainObj)));


/** @see react-dom/cjs/react-dom.development.js:12230 */
export const MAX_SIGNED_31_BIT_INT = (2 ** 30) - 1;

/**
 * Reverses a Map.
 * @template T, U
 * @param {Map<T, U>} aMap - The map to reverse
 * @returns {Map<U, T>}
 */
export const reverseMap = aMap => new Map(
  Array.from(aMap).map(([newVal, newKey]) => [ newKey, newVal ])
);

/**
 * @typedef {Object.<string, number>} ChromeVersion
 * @property {number} major
 * @property {number} minor
 * @property {number} build
 * @property {number} patch
 */
/**
 * Returns the Chrome / Chromium version the code is executing in, or
 * `null` if it's not Chrome or the version can't be determined.
 * @see https://www.chromium.org/developers/version-numbers
 * @returns {null | ChromeVersion}
 */
export function getChromeVersion() {
  const keys = [ 'major', 'minor', 'build', 'patch' ];
  try {
    return Object.fromEntries(
      /([Cc]hrom(e|ium)\/(?<version>[0-9.]*?))[\s$]/
        .exec(globalThis.navigator.appVersion)
        .groups.version.split('.')
        .map(vStr => [ keys.shift(), parseInt(vStr, 10) ])
    );
  } catch(e) {
    return null;
  }
}

/**
 * Get highest order bit
 * @example
 > let n = 0b0011_1110_1000_0000_0000  // 256,000
 > hibit(n).toString(2)  // formatted for pretty, 131.072
 0b0010_0000_0000_0000_0000
 *
 * @param {number} n
 * @returns {number}
 */
export const hibit = n => (1 << Math.trunc(Math.log2(n)));

export const SI_FILE_SIZES = [
  'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'
];
export const BINARY_FILE_SIZES = [
  'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'
];

/**
 * Taken from {@link https://stackoverflow.com/a/14919494 this great SO answer}.
 * @example
 > toHumanReadableSize(5000, true)
 '5.0 kB'
 > toHumanReadableSize(5000, false)
 '4.9 KiB'
 > toHumanReadableSize(-10000000000000000000000000000)
 '-8271.8 YiB'
 *
 * @param {number} numBytes
 * @param {boolean} useSI
 * @param {number} decimals
 * @returns {string}
 */
export function humanReadableSize(numBytes, useSI = false, decimals = 1) {
  numBytes = typeof numBytes  !== 'number' ? 0 : numBytes;
  decimals = typeof decimals  !== 'number' ? 1 : decimals;
  const div = useSI ? 10 ** 3 : 2 ** 10;
  if(Math.abs(numBytes) < div) return `${numBytes} B`;
  const units = useSI ? SI_FILE_SIZES : BINARY_FILE_SIZES;
  const lastUnitIdx = units.length - 1;
  let u = -1;
  do numBytes /= div; while(Math.abs(numBytes) >= div && ++u < lastUnitIdx);
  return `${numBytes.toFixed(decimals)} ${units[u]}`;
}
