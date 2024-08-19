import { AddressType } from '../schemas/address.schema';
import { LocationType } from '../schemas/location.schema';
import { ResourceType } from '../../resources/resource.schema';

export type CreateCommunityCenterDto = {
  name: string;
  address: AddressType;
  location: LocationType;
  maxCapacity: number;
  currentOccupancy: number;
  resources: ResourceType;
};
