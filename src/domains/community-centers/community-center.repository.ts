import mongoose from 'mongoose';
import { CommunityCenterModel } from './community-center.model';
import { CreateCommunityCenterDto } from './dto/create-community-center.dto';
import { NotFoundError } from '../../errors';

async function create(dto: CreateCommunityCenterDto) {
  return await CommunityCenterModel.create(dto);
}

async function updateCurrentOccupancy(id: string, currentOccupancy: number) {
  return await CommunityCenterModel.findByIdAndUpdate(
    { _id: id },
    { currentOccupancy },
    { returnDocument: 'after' },
  );
}

async function findById(id: string) {
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) {
    throw new NotFoundError('Community Center not found');
  }

  return await CommunityCenterModel.findById(id);
}

export const communityCenterRepository = {
  create,
  updateCurrentOccupancy,
  findById,
};
