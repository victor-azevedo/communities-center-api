import mongoose, { Connection } from 'mongoose';
import { CommunityCenterModel } from './community-center.model';
import { CreateCommunityCenterDto } from './dto/create-community-center.dto';
import { NotFoundError } from '../../errors';
import { ResourceType } from '../resources/resource.schema';

async function getAll() {
  return await CommunityCenterModel.find();
}

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

async function updateResourcesAB(
  aId: string,
  aResources: ResourceType,
  bId: string,
  bResources: ResourceType,
) {
  // Realizando uma transação com mongoose, para garantir a atomicidade
  const connection: Connection = mongoose.connection;
  const session = await connection.startSession();

  try {
    session.startTransaction();

    // Atualizando os recursos do centro A
    const aUpdated = await CommunityCenterModel.findByIdAndUpdate(
      { _id: aId },
      { resources: aResources },
      { session, returnDocument: 'after' },
    );

    // Atualizando os recursos do centro B
    const bUpdated = await CommunityCenterModel.findByIdAndUpdate(
      { _id: bId },
      { resources: bResources },
      { session, returnDocument: 'after' },
    );

    // Commit da transação
    await session.commitTransaction();

    return { aUpdated, bUpdated };
  } catch (error) {
    await session.abortTransaction();
    throw new Error('Error updating resources');
  } finally {
    session.endSession();
  }
}

export const communityCenterRepository = {
  getAll,
  create,
  updateCurrentOccupancy,
  findById,
  updateResourcesAB,
};
