import { Schema } from 'mongoose';
import { SchemaValidateType } from '../../types/schema-validate.type';

export enum ResourceEnum {
  Medical = 'Médico',
  Volunteer = 'Voluntário',
  MedicalKit = 'Kit de suprimentos médicos',
  TransportVehicle = 'Veículo de transporte',
  FoodBasket = 'Cesta básica',
}

export type ResourceType = {
  [ResourceEnum.Medical]?: number;
  [ResourceEnum.Volunteer]?: number;
  [ResourceEnum.MedicalKit]?: number;
  [ResourceEnum.TransportVehicle]?: number;
  [ResourceEnum.FoodBasket]?: number;
};

export const validateResourceQuantityErrorMessage =
  'Quantity must be greater than or equal to 0';

export const validateResourceQuantity: SchemaValidateType = {
  validator: (quantity: number) => quantity >= 0,
  message: validateResourceQuantityErrorMessage,
};

export const ResourceSchema = new Schema<ResourceType>({
  [ResourceEnum.Medical]: {
    type: Number,
    required: true,
    validate: validateResourceQuantity,
    default: 0,
  },
  [ResourceEnum.Volunteer]: {
    type: Number,
    required: true,
    validate: validateResourceQuantity,
    default: 0,
  },
  [ResourceEnum.MedicalKit]: {
    type: Number,
    required: true,
    validate: validateResourceQuantity,
    default: 0,
  },
  [ResourceEnum.TransportVehicle]: {
    type: Number,
    required: true,
    validate: validateResourceQuantity,
    default: 0,
  },
  [ResourceEnum.FoodBasket]: {
    type: Number,
    required: true,
    validate: validateResourceQuantity,
    default: 0,
  },
});
