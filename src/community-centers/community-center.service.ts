import mongoose, { mongo } from 'mongoose';
import { ConflictError, NotFoundError } from '../errors';
import { communityCenterRepository } from './community-center.repository';
import { CreateCommunityCenterDto } from './dto/create-community-center.dto';

async function create(dto: CreateCommunityCenterDto) {
  return await communityCenterRepository.create(dto);
}

async function updateCurrentOccupancy(id: string, currentOccupancy: number) {
  const communityCenter = await communityCenterRepository.findById(id);

  if (!communityCenter) {
    throw new NotFoundError('Community Center not found');
  }

  if (currentOccupancy > communityCenter.maxCapacity) {
    throw new ConflictError(
      'Current occupancy cannot be greater than max capacity',
    );
  }

  const occupationPercentage =
    (currentOccupancy / communityCenter.maxCapacity) * 100;
  if (occupationPercentage >= 90) {
    // TODO: Send alert
  }

  const updated = await communityCenterRepository.updateCurrentOccupancy(
    id,
    currentOccupancy,
  );

  return updated;
}

export const communityCenterService = {
  create,
  updateCurrentOccupancy,
};
