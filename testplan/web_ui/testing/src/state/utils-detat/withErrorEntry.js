/**
 * Adds an 'errors' entry to the passed-in object containing all the same keys
 * of the object mapped to empty arrays.
 * @example
 > const obj = { aaa: 1, bbb: 2 };
 > withErrorEntry(obj)
 {
   aaa: 1,
   bbb: 2,
   errors: {
     aaa: [],
     bbb: [],
   }
 }
 *
 * @template {object} T
 * @param {T} obj
 * @returns {Readonly<T>}
 */
export default function withErrorEntry(obj) {
  return Object.assign({}, obj, {
    errors: Object.fromEntries(
      Object.keys(obj).map(key => [key, []])
    ),
  });
}
