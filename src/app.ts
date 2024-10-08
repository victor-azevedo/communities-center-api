import express, { Application, Request, Response } from 'express';
import { handleApplicationError } from './middlewares/handle-error-middleware';
import communityCenterRouter from './domains/community-centers/community-center.route';

const app: Application = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => res.send("I'm alive!!!"));

app.use('/community-centers', communityCenterRouter);

// Middleware para tratamento de erros
app.use(handleApplicationError); // IMPORTANTE: Deve ser o último middleware

export default app;
