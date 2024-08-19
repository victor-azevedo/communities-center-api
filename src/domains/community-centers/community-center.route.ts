import { Router } from 'express';
import { communityCenterController } from './community-center.controller'; // Import the communityCenterController
import { updateOccupancyDtoSchema } from './dto/update-occupancy.dto';
import { validateBody } from '../../middlewares/request-validation-middleware';

const communityCenterRouter = Router();

communityCenterRouter.post('/', communityCenterController.create);
communityCenterRouter.patch(
  '/current-occupancy/:id',
  validateBody(updateOccupancyDtoSchema),
  communityCenterController.updateCurrentOccupancy,
);

export default communityCenterRouter;
