import _escapeRegExp from 'lodash/escapeRegExp';
import { reverseMap } from './utils';

/**
 * The keys here are characters that have special meaning in a URL,
 * and unfortunately React Router can't be relied upon to consistently
 * serialize (search "react router URL encode slashes in route"), and
 * doesn't provide a super-easy way to DIY the serialization.
 *
 * We use a `Map` since we need '%' to be serialized first, and `Map`
 * maintains order.
 */
const originalToPctEscapedMap = new Map([
  '%', '?', '#', ':', '/', '@', ']', '[', '!', '$',
  '&', "'", '(', ')', '=', ';', '+', '*', ',',
].map(c => [ c, `%${c.charCodeAt(0).toString(16)}` ]));

const mkTranslator = charmap => uriComponent => (
  [ charmap ].reduce((prevStr, [oldChar, newChar]) =>
    prevStr.replace(RegExp(_escapeRegExp(oldChar), 'g'), newChar),
    uriComponent
  )
);

export default {
  /**
   * @function uriComponentCodec.encode
   * @desc Apply custom URL encodings to a string.
   * @param {string} uriComponent - The string to encode
   * @return {string} - `uriComponent` with URL-unsafe characters replaced
   */
  encode: mkTranslator(originalToPctEscapedMap),
  /**
   * @function uriComponentCodec.decode
   * @desc Unapply custom URL encodings to a string.
   * @param {string} uriComponent - The string to decode
   * @return {string} - `uriComponent` with URL-unsafe characters restored
   */
  decode: mkTranslator(reverseMap(originalToPctEscapedMap)),
};
