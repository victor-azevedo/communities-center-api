import {
  validateResourceQuantity,
  validateResourceQuantityErrorMessage,
} from './resource.schema';

describe('[ResourceSchema] validateResourceQuantity', () => {
  it('should return true for a valid quantity greater than or equal to 0', () => {
    const validQuantities = [0, 1, 10, 100];

    validQuantities.forEach((quantity) => {
      const result = validateResourceQuantity.validator(quantity);
      expect(result).toBe(true);
    });
  });

  it('should return false for an invalid quantity less than 0', () => {
    const invalidQuantities = [-1, -10, -100];

    invalidQuantities.forEach((quantity) => {
      const result = validateResourceQuantity.validator(quantity);
      expect(result).toBe(false);
    });
  });

  it('should return the correct error message for invalid quantity', () => {
    expect(validateResourceQuantity.message).toBe(
      validateResourceQuantityErrorMessage,
    );
  });
});
