import express, { Application, Request, Response } from 'express';

const app: Application = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => res.send("I'm alive!!!"));

export default app;
