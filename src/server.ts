import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { mongoConfig } from './database/mongo.config';

const initServer = async () => {
  await mongoConfig();

  const DEFAULT_PORT = 3000;

  const port = Number(process.env.PORT) || DEFAULT_PORT;
  app.listen(port, () => {
    console.log(`[LOG] Listening on Port: ${port}`);
  });
};

initServer();
