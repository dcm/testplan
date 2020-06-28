import {StyleSheetTestUtils} from "aphrodite";
import {CreateNavButtons, GetSelectedUid} from '../navUtils';
import { TESTPLAN_REPORT_1 as REPORT } from '../../__tests__/documents';

describe('navUtils', () => {

  describe('CreateNavButtons', () => {

    beforeEach(() => {
      // Stop Aphrodite from injecting styles, this crashes the tests.
      StyleSheetTestUtils.suppressStyleInjection();
    });

    afterEach(() => {
      // Resume style injection once test is finished.
      StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
    });

    it('returns an array of nav buttons', () => {
      const props = {
        breadcrumbLength: 1,
        displayTags: false,
        displayTime: false,
        displayEmpty: true,
        handleNavClick: jest.fn(),
        entries: REPORT.entries,
        filter: null,
      }
      const createEntryComponent = jest.fn();
      const selectedUid = REPORT.uid;

      const navButtons = CreateNavButtons(
        props, createEntryComponent, selectedUid
      );
      expect(navButtons.length).toBe(props.entries.length);
      expect(navButtons).toMatchSnapshot();
    });
  });

  describe('GetSelectedUid', () => {
    it('gets the selected UID', () => {
      const selected = [REPORT];
      const uid = GetSelectedUid(selected);
      expect(uid).toBe(REPORT.uid);
    });
  });

});

