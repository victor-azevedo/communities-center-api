import { Router } from 'express';
import { communityCenterController } from './community-center.controller'; // Import the communityCenterController
import { validateBody } from '../middlewares/request-validation-middleware';
import { updateOccupancyDtoSchema } from './dto/update-occupancy.dto';

const communityCenterRouter = Router();

communityCenterRouter.post('/', communityCenterController.create);
communityCenterRouter.patch(
  '/current-occupancy/:id',
  validateBody(updateOccupancyDtoSchema),
  communityCenterController.updateCurrentOccupancy,
);

export default communityCenterRouter;
