import { CommunityCenterModel } from './community-center.model';
import { validatePostalCodeErrorMessage } from './schemas/address.schema';
import {
  validateLatitudeErrorMessage,
  validateLongitudeErrorMessage,
} from './schemas/location.schema';
import { ResourceEnum } from '../resources/resource.schema';

describe('[CommunityCenterModel] ', () => {
  it('should save a valid community center', async () => {
    const communityCenterValid = new CommunityCenterModel({
      name: 'Community Center 1',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345-678',
      },
      location: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
      maxCapacity: 100,
      currentOccupancy: 50,
      resources: {
        [ResourceEnum.Medical]: 50,
        [ResourceEnum.MedicalKit]: 50,
        [ResourceEnum.FoodBasket]: 50,
        [ResourceEnum.TransportVehicle]: 50,
        [ResourceEnum.Volunteer]: 50,
      },
    });

    const savedCommunityCenter = await communityCenterValid.save();
    expect(savedCommunityCenter._id).toBeDefined();
    expect(savedCommunityCenter.name).toBe('Community Center 1');
    expect(savedCommunityCenter.address.postalCode).toBe('12345-678');
    expect(savedCommunityCenter.location.latitude).toBe(-23.5505);
    expect(savedCommunityCenter.location.longitude).toBe(-46.6333);
  });

  it('should save a valid community center, with resources default 0', async () => {
    const communityCenterValid = new CommunityCenterModel({
      name: 'Community Center 1',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345-678',
      },
      location: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
      maxCapacity: 100,
      currentOccupancy: 50,
      resources: {
        [ResourceEnum.FoodBasket]: 50,
        [ResourceEnum.TransportVehicle]: 50,
        [ResourceEnum.Volunteer]: 50,
      },
    });

    const savedCommunityCenter = await communityCenterValid.save();
    expect(savedCommunityCenter._id).toBeDefined();
    expect(savedCommunityCenter.name).toBe('Community Center 1');
    expect(savedCommunityCenter.address.postalCode).toBe('12345-678');
    expect(savedCommunityCenter.location.latitude).toBe(-23.5505);
    expect(savedCommunityCenter.location.longitude).toBe(-46.6333);
    expect(savedCommunityCenter.resources[ResourceEnum.Medical]).toBe(0);
    expect(savedCommunityCenter.resources[ResourceEnum.MedicalKit]).toBe(0);
    expect(savedCommunityCenter.resources[ResourceEnum.FoodBasket]).toBe(50);
  });

  it('should fail to save a community center without resources', async () => {
    const communityCenterWithoutResources = new CommunityCenterModel({
      name: 'Community Center 1',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345-678',
      },
      location: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
      maxCapacity: 100,
      currentOccupancy: 50,
    });

    await expect(communityCenterWithoutResources.save()).rejects.toThrow(
      /resource/,
    );
  });

  it('should fail to save a community center with an invalid state', async () => {
    // Configurando um estado inválido
    const communityCenterInvalidState = new CommunityCenterModel({
      name: 'Community Center Invalid State',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'XX', // Estado inválido
        postalCode: '12345-678',
      },
      location: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
      maxCapacity: 100,
      currentOccupancy: 50,
      resources: {},
    });

    await expect(communityCenterInvalidState.save()).rejects.toThrow(/state/);
  });

  it('should fail to save a community center with invalid postal code', async () => {
    const communityCenter = new CommunityCenterModel({
      name: 'Community Center 2',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345678', // CEP inválido
      },
      location: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
      maxCapacity: 100,
      currentOccupancy: 50,
      resources: {},
    });

    expect(communityCenter.save()).rejects.toThrow(
      validatePostalCodeErrorMessage,
    );
  });

  it('should fail to save a community center with invalid latitude positive value', async () => {
    const communityCenter = new CommunityCenterModel({
      name: 'Community Center 3',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345-678',
      },
      location: {
        latitude: 90.1, // Latitude inválida, extrapolou limite superior
        longitude: -46.6333,
      },
      maxCapacity: 100,
      currentOccupancy: 50,
      resources: {},
    });

    expect(communityCenter.save()).rejects.toThrow(
      validateLatitudeErrorMessage,
    );
  });

  it('should fail to save a community center with invalid latitude negative value', async () => {
    const communityCenter = new CommunityCenterModel({
      name: 'Community Center 3',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345-678',
      },
      location: {
        latitude: -90.1, // Latitude inválida, extrapolou o limite inferior
        longitude: -46.6333,
      },
      maxCapacity: 100,
      currentOccupancy: 50,
      resources: {},
    });

    expect(communityCenter.save()).rejects.toThrow(
      validateLatitudeErrorMessage,
    );
  });

  it('should fail to save a community center with invalid longitude positive value', async () => {
    const communityCenter = new CommunityCenterModel({
      name: 'Community Center 4',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345-678',
      },
      location: {
        latitude: -23.5505,
        longitude: 181, // Longitude inválida, extrapolou limite superior
      },
      maxCapacity: 100,
      currentOccupancy: 50,
      resources: {},
    });

    expect(communityCenter.save()).rejects.toThrow(
      validateLongitudeErrorMessage,
    );
  });

  it('should fail to save a community center with invalid longitude negative value', async () => {
    const communityCenter = new CommunityCenterModel({
      name: 'Community Center 4',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345-678',
      },
      location: {
        latitude: -23.5505,
        longitude: -181, // Longitude inválida, extrapolou limite inferior
      },
      maxCapacity: 100,
      currentOccupancy: 50,
      resources: {},
    });

    expect(communityCenter.save()).rejects.toThrow(
      validateLongitudeErrorMessage,
    );
  });

  it('should fail to save a community center with negative max capacity or current occupancy', async () => {
    const communityCenter = new CommunityCenterModel({
      name: 'Community Center 5',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345-678',
      },
      location: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
      maxCapacity: -1, // Capacidade máxima não pode ser negativa, incoerência de valores
      currentOccupancy: -1, // Ocupação atual não pode ser negativa, incoerência de valores
      resources: {},
    });

    await expect(communityCenter.save()).rejects.toThrow(
      /Max capacity must be greater than or equal to 0, currentOccupancy: Current occupancy must be greater than or equal to 0/,
    );
  });

  it('should fail to save a community center with currentOccupancy greater than maxCapacity', async () => {
    const communityCenter = new CommunityCenterModel({
      name: 'Community Center 7',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345-678',
      },
      location: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
      maxCapacity: 100,
      currentOccupancy: 150, // Ocupação atual não pode ser maior que a capacidade máxima, incoerência de valores
      resources: {},
    });

    await expect(communityCenter.save()).rejects.toThrow(
      /Current occupancy cannot be greater than max capacity/,
    );
  });

  it('should success to save a community center with currentOccupancy equal to maxCapacity', async () => {
    const communityCenter = new CommunityCenterModel({
      name: 'Community Center 7',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345-678',
      },
      location: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
      maxCapacity: 150,
      currentOccupancy: 150, // Valid: currentOccupancy equal max capacity
      resources: {},
    });

    const savedCommunityCenter = await communityCenter.save();
    expect(savedCommunityCenter._id).toBeDefined();
  });
});
