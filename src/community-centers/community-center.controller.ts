import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { CommunityCenterType } from './community-center.model';
import { communityCenterService } from './community-center.service';

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

export const communityCenterController = {
  create,
  updateCurrentOccupancy,
};
