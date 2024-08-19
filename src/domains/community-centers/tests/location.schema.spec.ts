import {
  validateLatitude,
  validateLatitudeErrorMessage,
  validateLongitude,
  validateLongitudeErrorMessage,
} from '../schemas/location.schema';

describe('[LocationModel] validateLatitude', () => {
  it('should return true for a valid latitude within the range -90 to 90', () => {
    const validLatitudes = [-90, 0, 45.123, 90];

    validLatitudes.forEach((lat) => {
      const result = validateLatitude.validator(lat);
      expect(result).toBe(true);
    });
  });

  it('should return false for an invalid latitude outside the range -90 to 90', () => {
    const invalidLatitudes = [-91, 90.1, 100, -100];

    invalidLatitudes.forEach((lat) => {
      const result = validateLatitude.validator(lat);
      expect(result).toBe(false);
    });
  });

  it('should return the correct error message for invalid quantity', () => {
    expect(validateLatitude.message).toBe(validateLatitudeErrorMessage);
  });
});

describe('validateLongitude', () => {
  it('should return true for a valid longitude within the range -180 to 180', () => {
    const validLongitudes = [-180, 0, 78.456, 180];

    validLongitudes.forEach((long) => {
      const result = validateLongitude.validator(long);
      expect(result).toBe(true);
    });
  });

  it('should return false for an invalid longitude outside the range -180 to 180', () => {
    const invalidLongitudes = [-181, 180.1, 200, -200];

    invalidLongitudes.forEach((long) => {
      const result = validateLongitude.validator(long);
      expect(result).toBe(false);
    });
  });

  it('should return the correct error message for invalid quantity', () => {
    expect(validateLongitude.message).toBe(validateLongitudeErrorMessage);
  });
});
