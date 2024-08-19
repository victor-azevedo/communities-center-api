import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { mongoConfig } from './src/database/mongo.config';

let mongoServer: MongoMemoryReplSet;

// Configuração do Jest para aplicar em todos os testes, evita a necessidade de repetir o código
beforeAll(async () => {
  // Cria instancia em memória do MongoDB para realizar os testes, evita a necessidade de ter um banco de dados real
  const mongoServer = await MongoMemoryReplSet.create({
    replSet: { count: 4 },
  });
  const mongoUri = mongoServer.getUri();

  await mongoConfig(mongoUri);
});

afterAll(async () => {
  // // Fecha conexão com o MongoDB ao final dos testes
  await mongoose.disconnect();
  await mongoose.connection.close();
});
