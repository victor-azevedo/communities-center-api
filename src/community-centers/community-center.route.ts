import { Router } from 'express';
import { communityCenterController } from './community-center.controller'; // Import the communityCenterController

const communityCenterRouter = Router();

communityCenterRouter.post('/', communityCenterController.create);

export default communityCenterRouter;
