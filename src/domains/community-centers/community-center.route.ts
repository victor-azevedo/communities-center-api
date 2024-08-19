import { Router } from 'express';
import { validateBody } from '../../middlewares/request-validation-middleware';
import { communityCenterController } from './community-center.controller'; // Import the communityCenterController
import { updateOccupancyDtoSchema } from './dto/update-occupancy.dto';

const communityCenterRouter = Router();

communityCenterRouter.get('/', communityCenterController.getAll);

communityCenterRouter.get('/:id', communityCenterController.getById);

communityCenterRouter.post('/', communityCenterController.create);

communityCenterRouter.patch(
  '/current-occupancy/:id',
  validateBody(updateOccupancyDtoSchema),
  communityCenterController.updateCurrentOccupancy,
);

communityCenterRouter.patch(
  '/resources/exchange',
  // validateBody(resourceExchangeDtoSchema),
  communityCenterController.resourceExchange,
);

export default communityCenterRouter;
