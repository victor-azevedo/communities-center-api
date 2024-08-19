import Joi from 'joi';

export const updateOccupancyDtoSchema = Joi.object({
  currentOccupancy: Joi.number().integer().min(0).required().messages({
    'number.base': 'Current occupancy must be a number.',
    'number.integer': 'Current occupancy must be an integer.',
    'number.min': 'Current occupancy cannot be less than 0.',
    'any.required': 'Current occupancy is required.',
  }),
});
