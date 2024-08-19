import httpStatus from 'http-status';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../../app';
import { ResourceEnum } from '../../resources/resource.schema';
import { CommunityCenterModel } from '../community-center.model';
import { ResourceExchangeDto } from '../dto/resources-exchange.dto';

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

describe('Resource Exchange API', () => {
  let communityCenterAId: string;
  let communityCenterBId: string;
  const maxCapacity = 100;

  beforeEach(async () => {
    // Criação do primeiro centro comunitário (Community Center A)
    const communityCenterA = await CommunityCenterModel.create({
      name: 'Community Center A',
      address: {
        street: 'Rua Teste A',
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

    // Criação do segundo centro comunitário (Community Center B)
    const communityCenterB = await CommunityCenterModel.create({
      name: 'Community Center B',
      address: {
        street: 'Rua Teste B',
        number: '456',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '98765-432',
      },
      location: {
        latitude: -23.5605,
        longitude: -46.6433,
      },
      maxCapacity,
      currentOccupancy: 70,
      resources: {
        [ResourceEnum.Medical]: 20,
        [ResourceEnum.MedicalKit]: 30,
        [ResourceEnum.FoodBasket]: 40,
        [ResourceEnum.TransportVehicle]: 20,
        [ResourceEnum.Volunteer]: 25,
      },
    });

    communityCenterAId = communityCenterA._id.toString();
    communityCenterBId = communityCenterB._id.toString();
  });

  afterEach(async () => {
    // Limpar a coleção após os testes
    await CommunityCenterModel.deleteMany({});
  });

  it('should exchange resources between two community centers and return status 200', async () => {
    const resourceExchangeData: ResourceExchangeDto = {
      communityCenterA: {
        id: communityCenterAId,
        resources: {
          [ResourceEnum.TransportVehicle]: 1,
          [ResourceEnum.Volunteer]: 2,
        },
      },
      communityCenterB: {
        id: communityCenterBId,
        resources: {
          [ResourceEnum.MedicalKit]: 1,
          [ResourceEnum.Medical]: 1,
        },
      },
    };

    const response = await request(app)
      .patch('/community-centers/resources/exchange')
      .send(resourceExchangeData)
      .expect(httpStatus.OK);

    expect(response.status).toBe(httpStatus.OK);

    expect(response.body.aUpdated.resources).toEqual({
      [ResourceEnum.Medical]: 51, // recebeu 1
      [ResourceEnum.MedicalKit]: 51, // recebeu 1
      [ResourceEnum.TransportVehicle]: 49, // doou 1
      [ResourceEnum.Volunteer]: 48, // doou 2
      [ResourceEnum.FoodBasket]: 50,
    });

    expect(response.body.bUpdated.resources).toEqual({
      [ResourceEnum.Medical]: 19, // doou 1
      [ResourceEnum.MedicalKit]: 29, // doou 1
      [ResourceEnum.TransportVehicle]: 21, // recebeu 1
      [ResourceEnum.Volunteer]: 27, // recebeu 2
      [ResourceEnum.FoodBasket]: 40,
    });
  });

  it('should not exchange resources if the exchange is not possible', async () => {
    const resourceExchangeData: ResourceExchangeDto = {
      communityCenterA: {
        id: communityCenterAId,
        resources: {
          [ResourceEnum.TransportVehicle]: 1000, // Quantidade excessiva
          [ResourceEnum.Volunteer]: 1000, // Quantidade excessiva
        },
      },
      communityCenterB: {
        id: communityCenterBId,
        resources: {
          [ResourceEnum.MedicalKit]: 1,
          [ResourceEnum.Medical]: 1,
        },
      },
    };

    const response = await request(app)
      .patch('/community-centers/resources/exchange')
      .send(resourceExchangeData)
      .expect(httpStatus.CONFLICT); // Espera um conflito (impossível trocar)

    expect(response.body.message).toBe('Exchange not possible');
  });

  it('should return 404 if one of the community centers is not found', async () => {
    const resourceExchangeData: ResourceExchangeDto = {
      communityCenterA: {
        id: new mongoose.Types.ObjectId().toString(), // ID inexistente
        resources: {
          [ResourceEnum.TransportVehicle]: 1,
          [ResourceEnum.Volunteer]: 2,
        },
      },
      communityCenterB: {
        id: communityCenterBId,
        resources: {
          [ResourceEnum.MedicalKit]: 1,
          [ResourceEnum.Medical]: 1,
        },
      },
    };

    const response = await request(app)
      .patch('/community-centers/resources/exchange')
      .send(resourceExchangeData)
      .expect(httpStatus.NOT_FOUND);

    expect(response.body.message).toBe('Community Center not found');
  });
});
