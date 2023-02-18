import { isNullOrUndefined, safelyParseJSON } from '../../helpers/utils.helper';

describe('utils', () => {
  describe('is null or undefined', () => {
    test('return true, null', () => {
      expect(isNullOrUndefined(null)).toBe(true);
    });
    test('return true, undefined', () => {
      expect(isNullOrUndefined(undefined)).toBe(true);
    });
    test('return false, Object', () => {
      expect(isNullOrUndefined({})).toBe(false);
    });
    test('return false, number', () => {
      expect(isNullOrUndefined(1)).toBe(false);
    });
    test('return false, string', () => {
      expect(isNullOrUndefined('lolo')).toBe(false);
    });
  });
});
