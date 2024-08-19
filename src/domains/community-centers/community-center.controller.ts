import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { communityCenterService } from './community-center.service';
import { CommunityCenterType } from './community-center.model';
import { ResourceExchangeDto } from './dto/resources-exchange.dto';

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const crateCommunityDto = req.body as CommunityCenterType;

    const data = await communityCenterService.create(crateCommunityDto);

    return res.status(httpStatus.CREATED).send(data);
  } catch (error) {
    next(error);
  }
}

async function updateCurrentOccupancy(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { currentOccupancy } = req.body;

    const data = await communityCenterService.updateCurrentOccupancy(
      id,
      parseInt(currentOccupancy),
    );

    return res.status(httpStatus.OK).send(data);
  } catch (error) {
    next(error);
  }
}

async function resourceExchange(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const resourceExchangeDto = req.body as ResourceExchangeDto;

    const data =
      await communityCenterService.resourceExchange(resourceExchangeDto);

    return res.status(httpStatus.OK).send(data);
  } catch (error) {
    next(error);
  }
}

export const communityCenterController = {
  create,
  updateCurrentOccupancy,
  resourceExchange,
};
