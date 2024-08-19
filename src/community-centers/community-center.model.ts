import { model, Schema } from 'mongoose';
import { SchemaValidateType } from '../types/schema-validate.type';
import { AddressSchema, AddressType } from './schemas/address.schema';
import { LocationSchema, LocationType } from './schemas/location.schema';
import { ResourceSchema, ResourceType } from './schemas/resource.schema';
import { BadRequestError, NotFoundError } from '../errors';

export type CommunityCenterType = {
  name: string;
  address: AddressType;
  location: LocationType;
  maxCapacity: number;
  currentOccupancy: number;
  resources: ResourceType;
};

export const validateMaxCapacityErrorMessage =
  'Max capacity must be greater than or equal to 0';

export const validateMaxCapacity: SchemaValidateType = {
  validator: (quantity: number) => quantity >= 0,
  message: validateMaxCapacityErrorMessage,
};

export const validateCurrentOccupancyErrorMessage =
  'Current occupancy must be greater than or equal to 0';

export const validateCurrentOccupancy: SchemaValidateType = {
  validator: (quantity: number) => quantity >= 0,
  message: validateCurrentOccupancyErrorMessage,
};

const CommunityCenterSchema = new Schema<CommunityCenterType>(
  {
    name: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    location: { type: LocationSchema, required: true },
    maxCapacity: {
      type: Number,
      required: true,
      validate: validateMaxCapacity,
    },
    currentOccupancy: {
      type: Number,
      required: true,
      default: 0,
      validate: validateCurrentOccupancy,
    },
    resources: { type: ResourceSchema, required: true },
  },
  {
    timestamps: true,
  },
);

export const validateOccupancyErrorMessage =
  'Current occupancy cannot be greater than max capacity';

export const validateOccupancy: (this: CommunityCenterType) => boolean =
  function () {
    const isCurrentOccupationLessThanMaxCapacity =
      this.currentOccupancy <= this.maxCapacity;

    return isCurrentOccupationLessThanMaxCapacity;
  };

CommunityCenterSchema.pre('validate', function (next) {
  if (!validateOccupancy.call(this)) {
    return next(new BadRequestError(validateOccupancyErrorMessage));
  }
  next();
});

const CommunityCenterModel = model('CommunityCenter', CommunityCenterSchema);

export { CommunityCenterModel };
