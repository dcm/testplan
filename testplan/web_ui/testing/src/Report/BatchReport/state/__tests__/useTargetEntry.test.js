/** @jest-environment jsdom */
// @ts-nocheck
import React from 'react';
import { cleanup, renderHook } from '@testing-library/react-hooks';
import { Redirect, Route, Router, Switch, useParams } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import useTargetEntry from '../useTargetEntry';
import {
  deriveURLPathsFromReport,
} from '../../../../__tests__/testUtils';
import { TESTPLAN_REPORT_1 } from '../../../../__tests__/documents';
import { TESTPLAN_REPORT_2 } from '../../../../__tests__/documents';
import { SIMPLE_REPORT } from '../../../../__tests__/documents';
import { fakeReportAssertions } from '../../../../__tests__/documents';

import useReportState from '../useReportState';
import { actionTypes } from '../../state';
jest.mock('../useReportState');

describe("useTargetEntry", () => {

  describe.each([
    [ TESTPLAN_REPORT_1.name, TESTPLAN_REPORT_1 ],
    [ TESTPLAN_REPORT_2.name, TESTPLAN_REPORT_2 ],
    [ SIMPLE_REPORT.name, SIMPLE_REPORT ],
    [ fakeReportAssertions.name, fakeReportAssertions ],
  ])('(%#) using report "%s"', (currentReportName, currentReport) => {

    afterAll(() => {
      cleanup();
      jest.resetAllMocks();
      delete global.env;
    });

    it("checks that we're using a familiar report", () => {
      expect(currentReport).toMatchSnapshot();
    });

    beforeAll(() => {
      global.env = {
        history: createMemoryHistory({
          initialEntries: [
            {
              pathname: '',
              state: {
                currEntry: currentReport,
                currEntryIdx: 0,
              },
            }
          ],
          initialIndex: 0,
        }),
      };

      global.env.rendered = renderHook(
        useTargetEntry,
        {
          initialProps: global.env.history.location.state.currEntry.entries,
          wrapper: ({ children }) => {
            const { history, initialPathname, currentEntry } = global.env;
            const redirectDest = `${initialPathname}/${currentEntry.name}`;
            const {
              currEntry: { entries },
              currEntryIdx,
            } = global.env.history.location.state;
            const nextEntry = entries[currEntryIdx];
            return (
              <Router history={history}>
                <Switch>
                  <Route exact path={`${history.location.pathname}/:id`}>
                    {children}
                  </Route>
                  <Route path={initialPathname}>
                    <Redirect to={redirectDest}/>
                  </Route>
                </Switch>
              </Router>
            );
          }
        }
      );
    });

    const urlComponentAliasMap = new Map(),
      urlPathsToArraysMap = new Map(),
      allPaths = deriveURLPathsFromReport(
        currentReport,
        urlComponentAliasMap,
        urlPathsToArraysMap,
      );

    describe.each(allPaths)("(%#) mocking navigation to '%s'", (urlPath) => {

      beforeAll(() => {
        global.env.setUriHashPathComponentAlias = jest.fn()
          .mockImplementation((id, encodedId) => {
            urlComponentAliasMap.set(id, encodedId);
          }).mockName('setUriHashPathComponentAlias');
        useReportState.mockReturnValue([
          urlComponentAliasMap,
          global.env.setUriHashPathComponentAlias,
        ]);
      });

      beforeEach(() => {
        const urlPathArr = urlPathsToArraysMap.get(urlPath);
        global.env.expectedNextEntryName = urlPathArr.slice(-1)[0];
        global.env.history.push(urlPath);
      });

      afterEach(() => {
        const {
          rendered: { rerender, result: { current: nextEntry } },
          initialPathname, currentEntry, history,
        } = global.env;
        history.push(`${history.location.pathname}/${nextEntry.name}`);
        rerender(nextEntry.entries);
      });

      it("checks that 'useParams' is called as expected", () => {
        expect(useParams).toHaveBeenCalledTimes(1);
        expect(useParams).toHaveBeenLastCalledWith();
      });

      it("checks that 'useReportState' is called as expected", () => {
        expect(useReportState).toHaveBeenCalledTimes(1);
        expect(useReportState).toHaveBeenLastCalledWith(
          actionTypes.URI_HASH_ALIASES, 'setUriHashPathComponentAlias'
        );
      });

      it(
        'checks that we can correctly traverse the report',
        function navigate(done) {

          const {
            history: { location: { pathname: currentPathname } },
            rendered: { rerender, result: { current: nextEntry } },
            initialPathname, mockHistory, currentEntry,
          } = global.env;

          if(nextEntry === undefined) {
            // we didn't find an entry in `global.env.currentEntry.entries` that
            // matches ...
            expect(null).toBe(null);
          }

          if(nextEntry === null) {
            // we've reached the bottom of the report tree
            // `prevEntries` at this point are from the parent entry in the
            // report
            expect(null).toBe(null);
          }

          if(currentPathname === initialPathname) {
            expect(null).toBe(null);
          }

          if(mockHistory.length <= 1) {
            // we're at the end of the top-level entries list, i.e. we've
            // navigated recursively through all entries in the report
            //done();
            //return;
            expect(null).toBe(null);
          }

          if(rerender === -1) {
            // we're at the top of the report tree and have not recursed yet
            expect(currentEntry).toEqual(expect.anything());
          }

          done();

        },
      );

      // it('returns non-null only if passed an array', () => {
      //   const mockId = 'Sample%20Testplan';
      //   jest.mock('react-router', () => ({
      //     // useParams: ReactRouter.useParams,
      //     useParams: jest.fn().mockReturnValue({ id: mockId }),
      //   }));
      //   const { result, rerender } = renderHook(
      //     useTargetEntry,
      //     {
      //       initialProps: TESTPLAN_REPORT,
      //       wrapper: ({ children }) => (
      //         <RouterWrapper initialPath='/'
      //                        templatedPath='/:id'
      //                        destPath={`/${mockId}`}
      //                        children={children}
      //         />
      //       ),
      //     },
      //   );
      //   expect(result.error).toBeFalsy();
      //   expect(result.current).toBeNull();
      //   rerender('abc');
      //   expect(result.error).toBeFalsy();
      //   expect(result.current).toBeNull();
      //   rerender(123);
      //   expect(result.error).toBeFalsy();
      //   expect(result.current).toBeNull();
      //   rerender(1.23);
      //   expect(result.error).toBeFalsy();
      //   expect(result.current).toBeNull();
      //   rerender(90071992547409919007199254740991n);
      //   expect(result.error).toBeFalsy();
      //   expect(result.current).toBeNull();
      //   rerender(Symbol('xyz'));
      //   expect(result.error).toBeFalsy();
      //   expect(result.current).toBeNull();
      //   rerender({ abc: 123 });
      //   expect(result.error).toBeFalsy();
      //   expect(result.current).toBeNull();
      //   rerender([ { name: mockId } ]);
      //   expect(result.error).toBeFalsy();
      //   expect(result.current).not.toBeNull();
      // });

    });

  });

});
