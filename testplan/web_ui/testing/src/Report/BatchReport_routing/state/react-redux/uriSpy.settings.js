/// <reference path="./uriSpy.settings.d.ts" />
// @ts-nocheck
/* eslint-disable max-len,@typescript-eslint/prefer-includes */
/**
 * @fileOverview
 * This file defines two related things:
 *
 *  (I.) URL Queries => Action Creators
 * ====================================
 * Which actions should be dispatched when certain search queries are entered
 * into the URL?
 *
 * If I navigate straight to http://my.web.site/?doFetch=0&admin=true,
 * should "doFetch" cause an action to be dispatched? Since "admin" is "true",
 * does that mean any user with this parameter in the URL is automatically
 * admin? (protip: No)
 *
 * (II.) Action Creators => URL Queries
 * ====================================
 * What queries should be inserted into the URL when an action is dispatched?
 *
 * If a user clicks this button ->  /¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯/¯¯|
 *                                 |  ENABLE DARK MODE |¯¯¯|
 *                                 \___________________\___|
 *
 * Should the URL change to
 * http://my.web.site/?doFetch=0&admin=true&darkMode=enabled ?
 *
 * This file lets you define these relationships in a _relatively_
 * straightforward way.
 *
 */
import { bare_setDisplayEmpty } from './slices/reportSlice';
import { bare_setFilter } from './slices/reportSlice';
import { bare_setShowTags } from './slices/reportSlice';
import { bare_setDoAutoSelect } from './slices/reportSlice';
import { bare_setDevel, bare_setTesting } from '../../../../state/appSlice';

const _types = {
  __DEV__: process.env.NODE_ENV !== 'production',
  __TEST__: process.env.NODE_ENV === 'test',
  MappingDirection: {
    PARAM_TO_ACTION_CREATOR: 'PARAM_TO_ACTION_CREATOR',
    ACTION_CREATOR_TO_PARAM: 'ACTION_CREATOR_TO_PARAM',
    BIDIRECTIONAL: 'BIDIRECTIONAL',
  }
};
const _defaults = {
  SearchParamActionMapObject: {
    param: null,
    action: null,
    direction: _types.MappingDirection.BIDIRECTIONAL,
    ci: false,
  }
};

if(false) {

  /**
   * This whole block will be removed my webpack's TerserPlugin when we run
   * `react-scripts build` since it's unreachable code.
   *
   * Here we're creating some dummy variables that we'll use only for
   * demonstration purposes.
   */

  // noinspection UnreachableCodeJS @ts-ignore
  /** @type {object} */
  const someFakeSlice = {};
  /** @type {import('./uriSpy.settings').IHistoryLocationComponentsMap} */
  // eslint-next-disable-line no-unused-vars
  const demo_module_exports = {

    /**
     * @desc
     * "hash" here means this object denotes the settings for react-router's
     * HashRouter.
     *
     * __NOTE__ that the only difference between routers is the type of history
     * it uses, so fundamentally this applies to routers whose history is
     * created with:
     * @example
     * require('history').createHashHistory({ ... })
     */
    hash: {

      /**
       * All routers break down URLs into Location objects which extend the type
       * `{ pathname: string; search: string; hash: string; }`.
       *
       * The current property is named "search", meaning that it defines
       * mappings from the `Location.search` property to our Redux action
       * creators.
       *
       * The mappings in the array will be used to:
       *
       *  (I.) URL Queries => Action Creators
       * ====================================
       *
       *   Tell our Redux middleware what actions should be dispatched whenever
       *   a defined query parameter is entered into the URL from outside of
       *   this app.
       *
       * (II.) Action Creators => URL Queries
       * ====================================
       *
       *   Tell some of our action creators to set some defined query
       *   parameters=val pair(s) in the URL whenever they are dispatched.
       *
       * The behind-the-scenes correspondence between a param=val pair and an
       * action creator is essentially
       *
       *  (I.) URL Queries => Action Creators
       * ====================================
       *
       *   1. The location in the browser changes from outside the app
       *   2. The new query params are compared to the previous ones
       *   3. If nothing changed then we return and continue as normal. If
       *      something did change:
       *        i. The changed query params are compared against the 'param'
       *           property of every element in the array below
       *       ii. If a match is found, the "val" of the "param=val" if passed
       *           through `JSON.parse("val")`, defaulting to a string if there
       *           are any issues parsing.
       *      iii. Finally we grab the action creator function(s) at the
       *           "action" property of the matched array element, and we pass
       *           the JSON.parse'd `val` in as the first argument
       *       iv. The resulting action is then dispatched in a thunk (search
       *           "redux-thunk" for more info on this)
       *   4. Now the process returns and we continue as normal.
       *
       * (II.) Action Creators => URL Queries
       * ====================================
       * key-value pairs, and the vals are JSON.parse'd.
       *
       * @example
       * > let s = 'https://github.com/ReactTraining/history/?test=0#listening'
       * > const location = require('history').createLocation(s)
       * > location  // a `state` prop is also included but it's irrelevant here.
       * {
       *   pathname: 'https://github.com/ReactTraining/history/',
       *   search: '?test=0',
       *   hash: '#listening',
       * }
       * > const usp = new URLSearchParams('?test=0')
       * > usp
       * URLSearchParams { 'test' => '0' }
       * > const finale = new Map(usp).set('test', JSON.parse(usp.get('test')))
       * > finale
       * Map { 'test' => 0 }
       */
      search: [  // a.k.a. query params
        /**
         * @desc
         * These are 1-1 mappings i.e. exactly one query param to exactly one action creator. Matched params
         * will call the corresponding action creator,
         *
         * e.g. "/a/b/c?displayEmptyX=false&filterX=pass" will cause
         * `reportSlice.bare_setDisplayEmpty(false)` and
         * `reportSlice.bare_setFilter("pass")` to be dispatched.
         */
        { param: 'displayEmptyX', action: someFakeSlice.setTODO1 },
        { param: 'filterX', action: someFakeSlice.setTODO2 },
        { param: 'showTagsX', action: someFakeSlice.setTODO3 },
        { param: 'doAutoSelectX', action: someFakeSlice.setTODO4 },
        /**
         * @desc
         * Here we map multiple query params to one action creator non-exclusively
         * - the effect is, whenever any one of these params is in the URL,
         *   the value of the param is JSON.parse'd and passed to the action
         *   creator, e.g. "http://a.b.c:80/x/y/#/A/B/?demo1=true" will dispatch
         *   `appSlice.bare_setIsDevel(true)` once.
         * - if both of these params are in the URL, the action creator will be
         *   dispatched twice, e.g. "http://a.b.c:80/x/y/#/A/B/?demo1=true&demo2=false" will
         *   dispatch `appSlice.bare_setIsDevel(true)` and `appSlice.bare_setIsDevel(false)`
         *     >- the order that they're called in depends on the order returned
         *       by `new URLSearchParams('?__DEMO__isDevelopment=true&__DEMO__devel=false')`
         *       >>- {@link https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams}
         *     >- The order returned by URLSearchParams depends on the browser, it seems...
         *       >>- {@link https://github.com/whatwg/url/issues/27}
         */
        { param: 'demo1', action: someFakeSlice.setTODO5 },
        { param: 'demo2', action: someFakeSlice.setTODO6 },
        /**
         * @desc
         * Here we map multiple query params to one action creator _exclusively_
         * - the effect is, whenever any one of these params is in the URL,
         *   the value of the param is JSON.parse'd and passed to the action
         *   creator, e.g. "http://a.b.c:80/x/y/#/A/B/?demo3=true" will dispatch
         *   `someFakeSlice.setTODO7(true)` once.
         * - Matching is stopped at the first match meaning that "http://a.b.c:80/x/y/#/A/B/?demo3=true&demo4=false"
         *   will dispatch ONLY `someFakeSlice.setTODO7(false)` since "demo4" is earlier in the array
         */
        { param: ['demo4', 'demo3'], action: someFakeSlice.setTODO7 },
        /**
         * @desc
         * Similarly a query param can be mapped to >1 action creator, e.g. "/#/A/B/?demo5=22" will cause
         * `someFakeSlice.setTODO8(22)` and `someFakeSlice.setTODO9(22)` to both be dispatched.
         */
        {
          param: 'demo5',
          action: [ someFakeSlice.setTODO8, someFakeSlice.setTODO9 ]
        },
        /**
         * @desc
         * The following won't work and willl be ignored with a warning. It's not clear what it should
         * represent.
         */
        {
          param: [ 'wontwork1', 'wontwork2' ],
          action: [ someFakeSlice.wontDispatch1, someFakeSlice.wontDispatch2 ],
        },


        { param: 'isDevel', action: someFakeSlice.setTODO8 },
        { param: 'development', action: someFakeSlice.bare_setIsDevel },
        { param: 'isDevelopment', action: someFakeSlice.bare_setIsDevel },
      ],
    },
  };
}

/** @type {import('./uriSpy.settings').IHistoryLocationComponentsMap} */
module.exports = {
  hash: {
    search: [
      { param: 'displayEmpty', action: bare_setDisplayEmpty, ci: true },
      { param: 'filter', action: bare_setFilter, ci: true },
      { param: 'showTags', action: bare_setShowTags, ci: true },
      { param: 'doAutoSelect', action: bare_setDoAutoSelect },
    ],
  },
  _types,
  // @ts-ignore
  _defaults,
};

if(false&&_types.__DEV__&&module.exports.hash&&module.exports.hash.search) {
  // this will all be removed by webpack when NODE_ENV=production e.g. when we run `react-scripts build`
  module.exports.hash.search.push(...[
    {
      param: [ 'dev', 'devel', 'isDev', 'isDevel', 'development', 'isDevelopment' ],
      action: bare_setDevel,
    },
  ]);
  if(_types.__TEST__) {
    module.exports.hash.search.push(...[
      {
        param: ['test', 'testing', 'isTest', 'isTesting'],
        action: bare_setTesting,
      },
      {
        param: ['isDevTest', 'isTestDev'],
        action: [ bare_setDevel, bare_setTesting ],
      },
    ]);
  }
}
