import httpStatus from 'http-status';
import request from 'supertest';
import { ResourceEnum } from '../src/community-centers/schemas/resource.schema';
import app from './../src/app';
import { CommunityCenterModel } from '../src/community-centers/community-center.model';
import mongoose from 'mongoose';

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

describe('PATCH /community-centers/current-occupancy/:id', () => {
  let communityCenterId: string;
  const maxCapacity = 100;

  beforeEach(async () => {
    const communityCenter = await CommunityCenterModel.create({
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
      maxCapacity,
      currentOccupancy: 50,
      resources: {
        [ResourceEnum.Medical]: 50,
        [ResourceEnum.MedicalKit]: 50,
        [ResourceEnum.FoodBasket]: 50,
        [ResourceEnum.TransportVehicle]: 50,
        [ResourceEnum.Volunteer]: 50,
      },
    });

    communityCenterId = communityCenter._id.toString();
  });

  afterEach(async () => {
    // Limpar a coleção após os testes
    await CommunityCenterModel.deleteMany({});
  });

  it('should update the current occupancy and return status 200', async () => {
    const validUpdate = {
      currentOccupancy: 30,
    };

    const response = await request(app)
      .patch(`/community-centers/current-occupancy/${communityCenterId}`)
      .send(validUpdate)
      .expect(httpStatus.OK);

    expect(response.body.currentOccupancy).toBe(validUpdate.currentOccupancy);
  });

  it('should fail to update the current occupancy override max capacity', async () => {
    const invalidUpdate = {
      currentOccupancy: maxCapacity + 1, // Valor maior que capacidade máxima
    };

    const response = await request(app)
      .patch(`/community-centers/current-occupancy/${communityCenterId}`)
      .send(invalidUpdate)
      .expect(httpStatus.CONFLICT);

    expect(response.body?.message).toContain(
      'Current occupancy cannot be greater than max capacity',
    );
  });

  it('should fail to update the current occupancy with invalid value', async () => {
    const invalidUpdate = {
      currentOccupancy: -10, // Valor inválido
    };

    const response = await request(app)
      .patch(`/community-centers/current-occupancy/${communityCenterId}`)
      .send(invalidUpdate)
      .expect(httpStatus.BAD_REQUEST);

    expect(response.body?.message).toContain(
      'Current occupancy cannot be less than 0.',
    );
  });

  it('should fail to update the current occupancy if "id" does not exist', async () => {
    const invalidId = new mongoose.Types.ObjectId().toString();
    const validUpdate = {
      currentOccupancy: 30,
    };

    const response = await request(app)
      .patch(`/community-centers/current-occupancy/${invalidId}`)
      .send(validUpdate)
      .expect(httpStatus.NOT_FOUND);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should fail to update the current occupancy if no body is provided', async () => {
    const response = await request(app)
      .patch(`/community-centers/current-occupancy/${communityCenterId}`)
      .send({})
      .expect(httpStatus.BAD_REQUEST);

    expect(response.body?.message).toContain('Current occupancy is required.');
  });

  it('should fail to update the current occupancy with a non-integer value', async () => {
    const invalidUpdate = {
      currentOccupancy: 'string', // Valor inválido
    };

    const response = await request(app)
      .patch(`/community-centers/current-occupancy/${communityCenterId}`)
      .send(invalidUpdate)
      .expect(httpStatus.BAD_REQUEST);

    expect(response.body?.message).toContain(
      'Current occupancy must be a number.',
    );
  });
});
