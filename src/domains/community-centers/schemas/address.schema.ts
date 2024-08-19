import { Schema } from 'mongoose';
import { SchemaValidateType } from '../../../types/schema-validate.type';

export enum AddressStatesEnum {
  AC = 'AC',
  AL = 'AL',
  AP = 'AP',
  AM = 'AM',
  BA = 'BA',
  CE = 'CE',
  DF = 'DF',
  ES = 'ES',
  GO = 'GO',
  MA = 'MA',
  MT = 'MT',
  MS = 'MS',
  MG = 'MG',
  PA = 'PA',
  PB = 'PB',
  PR = 'PR',
  PE = 'PE',
  PI = 'PI',
  RJ = 'RJ',
  RN = 'RN',
  RS = 'RS',
  RO = 'RO',
  RR = 'RR',
  SC = 'SC',
  SP = 'SP',
  SE = 'SE',
  TO = 'TO',
}

export type AddressType = {
  street: string;
  number: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: AddressStatesEnum;
  postalCode: string;
};

export const validatePostalCodeErrorMessage =
  'Postal Code should be in the format xxxxx-xxx';
export const validatePostalCode: SchemaValidateType = {
  validator: (v: string) => {
    const POSTAL_CODE_REGEX = /^\d{5}-\d{3}$/;
    return POSTAL_CODE_REGEX.test(v);
  },
  message: validatePostalCodeErrorMessage,
};

const AddressSchema = new Schema<AddressType>(
  {
    street: { type: String, required: true },
    number: { type: String, required: true, default: 'S/N' },
    complement: { type: String },
    neighborhood: { type: String },
    city: { type: String, required: true },
    state: {
      type: String,
      required: true,
      enum: Object.values(AddressStatesEnum),
    },
    postalCode: {
      type: String,
      required: true,
      validate: validatePostalCode,
    },
  },
  { _id: false },
);

export { AddressSchema };
