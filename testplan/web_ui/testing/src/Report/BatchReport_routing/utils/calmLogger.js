/* global globalThis */
// @ts-nocheck
const __DEV__ = 'production' !== process.env.NODE_ENV;

/**
 * Calm breathless warnings from 3rd party libs. Becomes a noop when
 * NODE_ENV === 'production'. Can also be disabled by setting
 * the environment variable REACT_APP_DISABLE_CALM_CONSOLE to a falsy value.
 *
 * This function lets you safely gather log messages that are coming too
 * frequently and output them in a summarized form at set intervals.
 *
 * @param {object} [props={}]
 * @param {RegExp} [props.rexp='\wtext.*?future\s\b'] -
 *     regular expression to check `logger[srcStreamName]` for
 * @param {string} [props.srcStreamName="error"] -
 *     the stream on `logger` that you're wanting to calm
 * @param {string} [props.dstStream="debug"] -
 *     the stream on `logger` to which `srcStreamName` will be redirected to
 * @returns {object}
 */
export default function calmLogger(props = {}) {
  if(!__DEV__) return () => {};  // noop
  const {
    srcStream = 'error',
    dstStream = 'debug',
    rgx = /\wtex\w\b.*?future\s.*?\s\breact\b/i
  } = props;
  return CalmLogger.register(srcStream, dstStream, rgx);
}

/**
 * @typedef {Object} DaemonizeReturnValue
 * @prop {Map<number, any>} returns -
 *     Map of <start time of `cb()`> => <return value of `cb()`>
 * @prop {Map<string, Error[]>} errors -
 *     Map of <stream name> => <errors thrown array>
 * @prop {Promise<void, Error>>} daemon -
 *     The currently running daemon promise
 * @prop {Promise<void, Error>>} current -
 *     The currently running promise that was started by `daemon`
 */
/**
 * @typedef {Object} DaemonizeOptions
 * @prop {function(number): void} [waitFunc=] -
 *     Function to run if there is time remaining after `cb()` completes
 * @prop {boolean} [synchronizedErrors=false] -
 *    Use a synchronized Map for DaemonizeReturnValue["errors"]
 * @prop {boolean} [synchronizedErrorsArray=false] -
 *    Use a synchronized Array as the storage for values in
 *    DaemonizeReturnValue["errors"]
 * @prop {boolean} [synchronizedReturnsArray=false] -
 *    Use a synchronized Array as the storage for values in
 *    DaemonizeReturnValue["returns"]
 */
/**
 * @callback Function0ArgsAnyReturn
 * @returns {any}
 */
/**
 * @callback AsyncFunction0ArgsAnyReturn
 * @returns {PromiseLike<any>}
 */
/**
 * Creates a daemon from a function.
 * @param {Function0ArgsAnyReturn | AsyncFunction0ArgsAnyReturn} cb -
 *     Function to run in a loop
 * @param {function(): boolean} stopCb -
 *     Function that should return `false` if the daemon should continue
 * @param {number} interval -
 *     Minimum milliseconds to wait between runs.
 * @param {DaemonizeOptions} [options={}] -
 *     Options
 * @returns {DaemonizeReturnValue}
 */
function daemonize(cb, stopCb, interval, options = {}) {
  const {
      synchronizedErrors = false,
      synchronizedErrorsArray = false,
      synchronizedReturnsArray = false,
    } = options,
    /** @type {Map<string, Error[]>} */
    errQueueMap = synchronizedErrors ? new SynchronizedMap() : new Map(),
    /** @type {Map<number, any>} */
    rvMap = synchronizedReturnsArray ? new SynchronizedMap() : new Map(),
    addError = (streamName, error) => {
      if(errQueueMap.has(streamName)) errQueueMap.get(streamName).push(error);
      else errQueueMap.set(
        streamName,
        synchronizedErrorsArray ? new SynchronizedArray(error) : [error]
      );
    };
  let currentRunner = new Promise(res => res());
  let maxRunTime = interval;  // adjust interval to be greatest of all run times
  const NEW_INTERVAL = 'NEW_INTERVAL'
  return {
    returns: rvMap,
    errors: errQueueMap,
    get current() { return currentRunner; },
    daemon: new Promise(function runActivity(resolve, reject) {
      try {
        const id = setInterval(() => {
          const sTime = Date.now();
          if(stopCb()) {
            clearInterval(id);
            resolve();
          } else {
            currentRunner.finally(() => {
              currentRunner = new Promise((resolve, reject) => {
                try {
                  const rv = cb();
                  if(rv instanceof Promise) {
                    rv.then(_rv => resolve(_rv)).catch(_err => reject(_err));
                  } else { resolve(rv); }
                } catch(err) { reject(err); }
              }).then(rv => {
                rvMap.set(sTime, rv);
              }).catch(err => {
                addError('warn', err);
              }).finally(() => {
                const runTime = Date.now() - sTime;
                if(runTime > maxRunTime) {
                  // only recurse if we exceeded maxRunTime, and if we did then
                  // make double this runTime the new maxRunTime so we have less
                  // recursion in the future
                  maxRunTime = 2 * runTime;
                  clearInterval(id);
                }
              });
            });
          }
        }, maxRunTime);
        // we only get here if runTime > maxRunTime
        runActivity(resolve, reject);
      } catch(err) {
        addError('error', err);
        reject(err);
      }
    }),
  };
}

/**
 * A subclass of `Map` that has an attribute `.locked` that can be set to
 * synchronize access between async contexts.
 */
class SynchronizedMap extends Map {
  locked = false;
  hold() {
    return new Promise(resolve => {
      const id = setInterval(() => {
        if(!this.locked) {
          this.locked = true;
          clearInterval(id);
          resolve(this);
        }
      }, 70);
    });
  }
  release() {
    this.locked = false;
    return this;
  }
  copy() { return new SynchronizedMap(this); }
  clear() {
    super.clear();
    return this;
  }
}

class SynchronizedArray extends Array {
  locked = false;
  hold() {
    return new Promise(resolve => {
      const id = setInterval(() => {
        if(!this.locked) {
          this.locked = true;
          clearInterval(id);
          resolve(this);
        }
      }, 50);
    });
  }
  release() {
    this.locked = false;
    return this;
  }
  push(...args) {
    super.push(...args);
    return this;
  }
  copy() { return new SynchronizedArray(this); }
}

/// everything's static since it could operate on globals
class CalmLogger {
  /** @typedef {string[]} Message */
  /** @typedef {string} DestinationStreamName */
  /**
   * @typedef Dumpable
   * @type {Map<string, SynchronizedArray<[Message, DestinationStreamName]>>}
   */
  /**
   * Holds a mapping <source stream name> => <match regex> => <dest stream names>
   * @type {Map<string, SynchronizedMap<RegExp, string[]>>}
   */
  static _registry = new Map();
  /**
   * Holds pending promises which are in the process of setting a new mapping
   * in {@link CalmLogger._registry}
   * @type {Promise[]}
   */
  static _registrations = [];
  /**
   * Holds pending promises which are in the process of unsetting a mapping
   * from {@link CalmLogger._registry}
   * @type {Promise[]}
   */
  static _deregistrations = [];
  /**
   * Mapping of stream names that we've proxied and the original native stream
   * @type {Object.<string, Console[keyof Console]>}
   */
  static _proxiedStreams = {};
  /**
   * Mapping of <destination stream name> => <Errors in _janitor.daemon>
   * @type {DaemonizeReturnValue.errors}
   */
  static _janitorErrors;
  /**
   * @type {object}
   * @property {DaemonizeReturnValue.current} current
   * @property {DaemonizeReturnValue.daemon} daemon
   */
  static _janitor = {};
  /**
   * Mapping of <destination stream name> => <Errors in _dumper.daemon>
   * @type {DaemonizeReturnValue.errors}
   */
  static _dumperErrors;
  /**
   * @type {object}
   * @property {DaemonizeReturnValue.current} current
   * @property {DaemonizeReturnValue.daemon} daemon
   */
  static _dumper = new Promise(res => { res(); });
  /**
   * Map=>Array structure containing intercepted messages:
   * <src stream name (where it was intercepted from)>
   * => Array<[ <actual intercepted message>, <dest stream name> ]>
   * @type {Dumpable}
   */
  static _intercepted = new Map();

  static _janitorRunner = new Promise(res => { res(); });
  static _lockJanitorDaemon = false;
  static _runJanitorDaemon = true;
  static get runJanitorDaemon() { return this._runJanitorDaemon; }
  static set runJanitorDaemon(isRun) {
    if(typeof this.__rJDRun === 'undefined')
      this.__rJDRun = new Promise(res => res());
    this.__rJDRun.finally(() => {
      const setIsRun = () => {
        if(!this._lockJanitorDaemon) {
          // trigger re-init in dumpInterval setter if was off and now is on
          if(!this._runJanitorDaemon && isRun)
            this.janitorInterval = this._dumpInterval;
          this._runJanitorDaemon = isRun;
          return true;
        }
      };
      this.__rJDRun = new Promise(res => {
        if(setIsRun()) res();
        else {
          const sTime = Date.now();
          if(typeof this.__rJDRunTime === 'undefined') this.__rJDRunTime = 10;
          const id = setInterval(() => {
            if(setIsRun()) {
              clearInterval(id);
              const eTime = Date.now();
              this.__rJDRunTime = Math.max(this.__rJDRunTime, eTime - sTime);
              res();
            }
          }, this.__rJDRunTime);
        }
      });
    });
  }
  static _janitorInterval = 5000;
  static get janitorInterval() { return this._janitorInterval; }
  static set janitorInterval(newInterval) {
    this._lockJanitorDaemon = true;
    const wasRunning = this._runJanitorDaemon;
    this._runJanitorDaemon = false;
    this._janitorInterval = newInterval;
    this._janitorRunner = this._janitorRunner.finally(() => {
      this._runJanitorDaemon = wasRunning;
      this._lockJanitorDaemon = false;
      const { daemon, current, errors } = daemonize(
        () => { this._cleanAll(); },
        () => !this.runJanitorDaemon,
        this._janitorInterval,
        { synchronizedErrorsArray: true }
      );
      this._janitor = { daemon, current };
      this._janitorErrors = errors;
    });
  }
  static async _cleanOne(promiseArr) {
    const donep = await Promise.race(promiseArr), tmp = [];
    while(promiseArr.length) {
      const el = promiseArr.shift();
      if(Object.is(el, donep)) {
        promiseArr.unshift(...tmp);
        break;
      } else tmp.push(el);
    }
  }
  static _cleanAll() {
    const cleanupPromiseArrays = [ this._registrations, this._deregistrations ];
    for(const promiseArr of cleanupPromiseArrays) this._cleanOne(promiseArr);
  }

  static _dumperRunner = new Promise(res => { res(); });
  static _lockDumperDaemon = false;
  static _runDumperDaemon = true;
  static _runDumperDaemonSetterPromise = new Promise(res => res());
  static get runDumperDaemon() { return this._runDumperDaemon; }
  static set runDumperDaemon(isRun) {
    if(typeof this.__rDDRun === 'undefined')
      this.__rDDRun = new Promise(res => res());
    this.__rDDRun.finally(() => {
      const setIsRun = () => {
        if(!this._lockDumperDaemon) {
          // trigger re-init in dumpInterval setter if was off and now is on
          if(!this._runDumperDaemon && isRun)
            this.dumpInterval = this._dumpInterval;
          this._runDumperDaemon = isRun;
          return true;
        }
      };
      this.__rDDRun = new Promise(res => {
        if(setIsRun()) res();
        else {
          const sTime = Date.now();
          if(typeof this.__rDDRunTime === 'undefined') this.__rDDRunTime = 10;
          const id = setInterval(() => {
            if(setIsRun()) {
              clearInterval(id);
              const eTime = Date.now();
              this.__rDDRunTime = Math.max(this.__rDDRunTime, eTime - sTime);
              res();
            }
          }, this.__rDDRunTime);
        }
      });
    });
  }
  static _dumpInterval = 15000;
  static get dumpInterval() { return this._dumpInterval; }
  static set dumpInterval(newInterval) {
    this._lockDumperDaemon = true;
    const wasRunning = this._runDumperDaemon;
    this._runDumperDaemon = false;
    this._dumpInterval = newInterval;
    this._dumperRunner = this._dumperRunner.finally(() => {
      this._runDumperDaemon = wasRunning;
      this._lockDumperDaemon = false;
      const { daemon, current, errors } = daemonize(
        () => { this._dumpAll(); },
        () => !this.runDumperDaemon,
        this._dumpInterval,
        { synchronizedErrorsArray: true }
      );
      this._dumper = { daemon, current };
      this._dumperErrors = errors;
    });
    return this._dumpInterval;
  }
  /** @param {Dumpable} dumpable @returns {Promise<void>} */
  static async _dumpOne(dumpable) {
    for(const [ srcName, msgDestNameSyncArr ] of dumpable) {
      const msgDestNameArr = await msgDestNameSyncArr.hold(),
        n = msgDestNameArr.length;
      if(!n) {
        msgDestNameSyncArr.release();
        continue;
      }
      globalThis.console.groupCollapsed(`${n} from console.${srcName}`);
      while(msgDestNameArr.length) {
        const [ msg, destName ] = msgDestNameArr.shift(),
          dest = globalThis.console[destName];
        if(Array.isArray(msg)) dest(...msg);
        else if(msg) dest(msg);
      }
      msgDestNameArr.release();
      globalThis.console.groupEnd();
    }
  }
  static _dumpAll(groupTitle = 'calmed messages') {
    if(typeof this._currDump === 'undefined') {
      this._currDump = new Promise(res => { res(); });
    }
    this._currDump = this._currDump.finally((resolve, reject) => {
      (async () => {
        try {
          const allDumpables = [
              { name: 'intercepted', val: this._intercepted }
            ],
            errors = new Map();
          globalThis.console.groupCollapsed(groupTitle);
          for(const dumpable of allDumpables) {
            if(!dumpable.val.size) continue;
            globalThis.console.groupCollapsed(dumpable.name);
            try { await this._dumpOne(dumpable.val); }
            catch(err) {
              if(!errors.has(dumpable.name)) errors.set(dumpable.name, []);
              errors.get(dumpable.name).push(err);
            }
            globalThis.console.groupEnd();
          }
          if(!errors.size) return;
          globalThis.console.groupCollapsed('dump errors');
          for(const [name, errArr] of errors) {
            if(!errArr.length) continue;
            globalThis.console.groupCollapsed(name);
            for(const err of errArr) console.error(err);
            globalThis.console.groupEnd();
          }
          globalThis.console.groupEnd();
          resolve();
        } catch(err) { reject(err); }
      })();
    });
  }

  static _unsetConsoleStreamProxy(name) {
    if(!this._proxiedStreams[name] || !globalThis.console[name]) return;
    globalThis.console[name] = this._proxiedStreams[name];
    this._proxiedStreams[name] = null;
  }

  static _setConsoleStreamProxy(name) {
    if(this._proxiedStreams[name] || !globalThis.console[name]) return;
    this._proxiedStreams[name] = globalThis.console[name];
    globalThis.console[name] = new Proxy(
      this._proxiedStreams[name], {
        apply: (target, thisArg, args) => {
          if(!this._registry.has(name) || !args.length) {
            target(...args);
            return;
          }
          for(const [ rgx, destArr ] of this._registry.get(name)) {
            if(RegExp(rgx).test(args[0])) {
              if(!this._intercepted.has(name)) {
                this._intercepted.set(name, new SynchronizedArray());
              }
              for(const dest of destArr) {
                this._intercepted.get(name).push([ args, dest ]);
              }
            }
          }
        }
      }
    );
  }

  static unregister(srcName, destName, filterRgx) {
    this._deregistrations.push(
      new Promise((resolve, reject) => {
        try {
          this._unsetConsoleStreamProxy(srcName);
          if(!this._registry.has(srcName)) return;
          this._registry.get(srcName).hold().then(rgxDestMap => {
            if(!rgxDestMap.has(filterRgx)) return;
            const destsArr = rgxDestMap.get(filterRgx), tmp = [];
            while(destsArr.length) {
              const dest = destsArr.shift();
              if(dest === destName) {
                destsArr.unshift(...tmp);
                break;
              } else tmp.push(dest);
            }
            if(!destsArr.length) rgxDestMap.delete(filterRgx);
            if(!rgxDestMap.size) this._registry.delete(srcName);
            else this._registry.get(srcName).release();
            resolve();
          });
        } catch(err) {
          this._registry.get(srcName).release();
          reject(err);
        }
      })
    );
    return this.register.bind(this, srcName, destName, filterRgx);
  }

  static register(srcName, destName, filterRgx) {
    // TODO: check for loops e.g. stream1 > stream2 > stream3 > stream1
    this._registrations.push(
      new Promise((resolve, reject) => {
        try {
          if(!this._registry.has(srcName)) {
            this._registry.set(srcName, new SynchronizedMap());
          }
          this._registry.get(srcName).hold().then(rgxDestMap => {
            if(!rgxDestMap.has(filterRgx)) rgxDestMap.set(filterRgx, []);
            const destNameArr = rgxDestMap.get(filterRgx);
            if(!destNameArr.includes(destName)) destNameArr.push(destName);
            this._setConsoleStreamProxy(srcName);
            this._registry.get(srcName).release();
            resolve();
          });
        } catch(err) {
          this._registry.get(srcName).release();
          reject(err);
        }
      })
    );
    return this.unregister.bind(this, srcName, destName, filterRgx);
  }

  static _init = (() => {
    // calls their setters to reassign static properties
    this.janitorInterval = this._janitorInterval;
    this.dumpInterval = this._dumpInterval;
  })();
}
