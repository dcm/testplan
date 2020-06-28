import { NAV_ENTRY_DISPLAY_DATA } from '../defaults';
import { getNavEntryDisplayData } from '../utils';

describe('Common/utils', () => {
  describe('getNavEntryDisplayData', () => {
    it('returns an empty object when given an empty object.', () => {
      const displayData = getNavEntryDisplayData({});
      for (const attribute of NAV_ENTRY_DISPLAY_DATA) {
        expect(displayData.hasOwnProperty(attribute)).toBeFalsy();
      }
    });
    it(
      'returns an object with the expected keys when given an object with them',
      () => {
        const entry = Object.fromEntries(
          NAV_ENTRY_DISPLAY_DATA.concat('unknown').map((val, i) => [val, i])
        );
        const displayData = getNavEntryDisplayData(entry);
        for (const attribute of NAV_ENTRY_DISPLAY_DATA) {
          expect(displayData[attribute]).toEqual(entry[attribute]);
        }
      }
    );
  });
});
