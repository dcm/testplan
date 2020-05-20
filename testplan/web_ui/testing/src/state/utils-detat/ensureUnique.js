const __DEV__ = 'production' !== process.env.NODE_ENV;
/**
 * Checks that the types in an object of action creators are all unique.
 * This does nothing when `NODE_ENV == 'production'`.
 *
 * @template {({}) | (Object.<string, (import("redux").ActionCreator)>)} T
 * @param {T[]} actionsObjects
 * @returns {Readonly<T>}
 */
export default function ensureUnique(...actionsObjects) {
  const combinedActionsObj = {};
  const actionsMap = new Map();
  for(const actionObj of actionsObjects) {
    if(__DEV__) {
      for(const [ varName, action ] of Object.entries(actionObj)) {
        const actionStr = action.toString();
        if(actionsMap.has(actionStr)) {
          const varNames = [ varName ];
          for(const [ _actionStr, _varName ] of actionsMap) {
            if(_actionStr === actionStr) {
              varNames.push(_varName);
            }
          }
          throw new Error(
            `Action type "${actionStr}" is reused for variables ` +
            `\`${varNames.join('`, `')}\`. Action types must be unique.`
          );
        }
        actionsMap.set(actionStr, varName);
      }
    }
    Object.assign(combinedActionsObj, actionObj);
  }
  // @ts-ignore
  return combinedActionsObj;
}
