import { validatePostalCode } from '../schemas/address.schema';

describe('[AddressSchema] validatePostalCode', () => {
  it('should return true for a valid postal code in the format xxxxx-xxx', () => {
    const validPostalCodes = ['12345-678', '98765-432', '00000-000'];

    validPostalCodes.forEach((postalCode) => {
      const result = validatePostalCode.validator(postalCode);
      expect(result).toBe(true);
    });
  });

  it('should return false for an invalid postal code', () => {
    const invalidPostalCodes = [
      '12345678', //
      '1234-567',
      '12345-6789',
      'ABCDE-FGH',
    ];

    invalidPostalCodes.forEach((postalCode) => {
      const result = validatePostalCode.validator(postalCode);
      expect(result).toBe(false);
    });
  });

  it('should return false for a postal code that is too short', () => {
    const shortPostalCode = '1234-567';
    const result = validatePostalCode.validator(shortPostalCode);
    expect(result).toBe(false);
  });

  it('should return false for a postal code that is too long', () => {
    const longPostalCode = '12345-67829';
    const result = validatePostalCode.validator(longPostalCode);
    expect(result).toBe(false);
  });
});
