import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { mongoConfig } from './src/database/mongo.config';

let mongoServer: MongoMemoryReplSet;

// Configuração do Jest para aplicar em todos os testes, evitando a necessidade de repetir o código
beforeAll(async () => {
  // Cria uma instância em memória do MongoDB para realizar os testes, evitando a necessidade de um banco de dados real
  mongoServer = await MongoMemoryReplSet.create({
    replSet: { count: 4 },
  });
  const mongoUri = mongoServer.getUri();

  // Configura o mongoose com o URI do MongoDB em memória
  await mongoConfig(mongoUri);
});

afterAll(async () => {
  // Fecha a conexão com o MongoDB ao final dos testes
  await mongoose.disconnect();
  await mongoServer.stop();
});
