import { Schema } from 'mongoose';
import { SchemaValidateType } from '../../../types/schema-validate.type';

export type LocationType = {
  latitude: number;
  longitude: number;
};

export const validateLatitudeErrorMessage =
  'Latitude must be between -90 and 90 degrees';
export const validateLatitude: SchemaValidateType = {
  validator: (lat: number) => lat >= -90 && lat <= 90,
  message: validateLatitudeErrorMessage,
};

export const validateLongitudeErrorMessage =
  'Longitude must be between -180 and 180 degrees';
export const validateLongitude: SchemaValidateType = {
  validator: (long: number) => long >= -180 && long <= 180,
  message: validateLongitudeErrorMessage,
};

const LocationSchema = new Schema<LocationType>(
  {
    latitude: {
      type: Number,
      required: true,
      validate: validateLatitude,
    },
    longitude: {
      type: Number,
      required: true,
      validate: validateLongitude,
    },
  },
  { _id: false },
);

export { LocationSchema };
