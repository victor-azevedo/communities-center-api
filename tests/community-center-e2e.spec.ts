import httpStatus from 'http-status';
import request from 'supertest';
import { ResourceEnum } from '../src/community-centers/schemas/resource.schema';
import app from './../src/app';

describe('POST /community-centers', () => {
  // Teste existente para criação bem-sucedida
  it('should create a new community center and return status 201', async () => {
    const communityCenterData = {
      name: 'Community Center Test',
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
    };

    const response = await request(app)
      .post('/community-centers')
      .send(communityCenterData)
      .expect(httpStatus.CREATED);

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual(expect.objectContaining(communityCenterData));
  });

  // Teste existente para falha ao criar sem recursos
  it('should fail to save a community center without resources', async () => {
    const communityCenterData = {
      name: 'Community Center Test',
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
    };

    const response = await request(app)
      .post('/community-centers')
      .send(communityCenterData)
      .expect(httpStatus.BAD_REQUEST);
  });

  // Teste para latitudes inválidas
  it('should fail to save a community center with invalid latitude', async () => {
    const communityCenterData = {
      name: 'Community Center Test',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345-678',
      },
      location: {
        latitude: 100, // Valor inválido
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
    };

    const response = await request(app)
      .post('/community-centers')
      .send(communityCenterData)
      .expect(httpStatus.BAD_REQUEST);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  // Teste para longitudes inválidas
  it('should fail to save a community center with invalid longitude', async () => {
    const communityCenterData = {
      name: 'Community Center Test',
      address: {
        street: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '12345-678',
      },
      location: {
        latitude: -23.5505,
        longitude: 200, // Valor inválido
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
    };

    const response = await request(app)
      .post('/community-centers')
      .send(communityCenterData)
      .expect(httpStatus.BAD_REQUEST);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  // Teste para currentOccupancy maior que maxCapacity
  it('should fail to save a community center with currentOccupancy greater than maxCapacity', async () => {
    const communityCenterData = {
      name: 'Community Center Test',
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
      currentOccupancy: 150, // Valor inválido
      resources: {
        [ResourceEnum.Medical]: 50,
        [ResourceEnum.MedicalKit]: 50,
        [ResourceEnum.FoodBasket]: 50,
        [ResourceEnum.TransportVehicle]: 50,
        [ResourceEnum.Volunteer]: 50,
      },
    };

    const response = await request(app)
      .post('/community-centers')
      .send(communityCenterData)
      .expect(httpStatus.BAD_REQUEST);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });
});
