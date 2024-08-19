import { ObjectSchema } from 'joi';
import { updateOccupancyDtoSchema } from './update-occupancy.dto';

describe('updateOccupancyDtoSchema', () => {
  it('should validate a valid update occupancy DTO', () => {
    const validDto = {
      currentOccupancy: 10,
    };

    const validationResult = validateSchema(validDto, updateOccupancyDtoSchema);
    expect(validationResult.error).toBeUndefined();
  });

  it('should not validate an update occupancy DTO with a negative current occupancy', () => {
    const invalidDto = {
      currentOccupancy: -5,
    };

    const validationResult = validateSchema(
      invalidDto,
      updateOccupancyDtoSchema,
    );
    expect(validationResult.error).toBeDefined();
    expect(validationResult.error?.details[0].message).toBe(
      'Current occupancy cannot be less than 0.',
    );
  });

  it('should not validate an update occupancy DTO without a current occupancy', () => {
    const invalidDto = {};

    const validationResult = validateSchema(
      invalidDto,
      updateOccupancyDtoSchema,
    );
    expect(validationResult.error).toBeDefined();
    expect(validationResult.error?.details[0].message).toBe(
      'Current occupancy is required.',
    );
  });

  it('should not validate an update occupancy DTO with a non-integer current occupancy', () => {
    const invalidDto = {
      currentOccupancy: 10.5,
    };

    const validationResult = validateSchema(
      invalidDto,
      updateOccupancyDtoSchema,
    );
    expect(validationResult.error).toBeDefined();
    expect(validationResult.error?.details[0].message).toBe(
      'Current occupancy must be an integer.',
    );
  });

  it('should not validate an update occupancy DTO with a non-number current occupancy', () => {
    const invalidDto = {
      currentOccupancy: 'invalid',
    };

    const validationResult = validateSchema(
      invalidDto,
      updateOccupancyDtoSchema,
    );
    expect(validationResult.error).toBeDefined();
    expect(validationResult.error?.details[0].message).toBe(
      'Current occupancy must be a number.',
    );
  });
});

function validateSchema(dto: any, schema: ObjectSchema<any>) {
  return schema.validate(dto, { abortEarly: false });
}
