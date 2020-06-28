/**
 * Common utility functions.
 */
import { NAV_ENTRY_DISPLAY_DATA } from './defaults';

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
 * Reverses a Map.
 * @template T, U
 * @param {Map<T, U>} aMap - The map to reverse
 * @returns {Map<U, T>}
 */
export const reverseMap = aMap => new Map(
  Array.from(aMap).map(([newVal, newKey]) => [ newKey, newVal ])
);

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
