import Joi from 'joi';
import { ResourceType } from '../resource.schema';

export const resourceDtoSchema = Joi.object<ResourceType>({
  Medical: Joi.number().integer().min(0).required().messages({
    'number.base': 'Medical resource quantity must be a number.',
    'number.integer': 'Medical resource quantity must be an integer.',
    'number.min': 'Medical resource quantity cannot be less than 0.',
    'any.required': 'Medical resource quantity is required.',
  }),
  Volunteer: Joi.number().integer().min(0).required().messages({
    'number.base': 'Volunteer resource quantity must be a number.',
    'number.integer': 'Volunteer resource quantity must be an integer.',
    'number.min': 'Volunteer resource quantity cannot be less than 0.',
    'any.required': 'Volunteer resource quantity is required.',
  }),
  MedicalKit: Joi.number().integer().min(0).required().messages({
    'number.base': 'MedicalKit resource quantity must be a number.',
    'number.integer': 'MedicalKit resource quantity must be an integer.',
    'number.min': 'MedicalKit resource quantity cannot be less than 0.',
    'any.required': 'MedicalKit resource quantity is required.',
  }),
  TransportVehicle: Joi.number().integer().min(0).required().messages({
    'number.base': 'TransportVehicle resource quantity must be a number.',
    'number.integer': 'TransportVehicle resource quantity must be an integer.',
    'number.min': 'TransportVehicle resource quantity cannot be less than 0.',
    'any.required': 'TransportVehicle resource quantity is required.',
  }),
  FoodBasket: Joi.number().integer().min(0).required().messages({
    'number.base': 'FoodBasket resource quantity must be a number.',
    'number.integer': 'FoodBasket resource quantity must be an integer.',
    'number.min': 'FoodBasket resource quantity cannot be less than 0.',
    'any.required': 'FoodBasket resource quantity is required.',
  }),
})
  .required()
  .messages({
    'object.base': 'Resources must be an object.',
    'any.required': 'Resources are required.',
  });
