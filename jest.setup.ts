import { mongoConfig } from './src/database/mongo.config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Configuração do Jest para aplicar em todos os testes, evita a necessidade de repetir o código
beforeAll(async () => {
  // Cria instancia em memória do MongoDB para realizar os testes, evita a necessidade de ter um banco de dados real
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoConfig(mongoUri);
});

afterAll(async () => {
  // Fecha conexão com o MongoDB ao final dos testes
  await mongoose.disconnect();
  await mongoServer.stop();
});
