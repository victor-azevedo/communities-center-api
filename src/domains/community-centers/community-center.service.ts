import { ConflictError, NotFoundError } from '../../errors';
import { resourcesService } from '../resources/resource.service';
import { communityCenterRepository } from './community-center.repository';
import { CreateCommunityCenterDto } from './dto/create-community-center.dto';
import { ResourceExchangeDto } from './dto/resources-exchange.dto';

export const calculateOccupationPercentage = (
  occupation: number,
  maxCapacity: number,
) => {
  return (occupation / maxCapacity) * 100;
};

async function getAll() {
  return await communityCenterRepository.getAll();
}

async function getById(id: string) {
  const communityCenter = await communityCenterRepository.findById(id);

  if (!communityCenter) {
    throw new NotFoundError('Community Center not found');
  }

  return communityCenter;
}

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

  const occupationPercentage = calculateOccupationPercentage(
    currentOccupancy,
    communityCenter.maxCapacity,
  );
  const OCCUPATION_PERCENTAGE_TO_ALERT = 100;
  if (occupationPercentage >= OCCUPATION_PERCENTAGE_TO_ALERT) {
    // TODO: Send alert
  }

  const updated = await communityCenterRepository.updateCurrentOccupancy(
    id,
    currentOccupancy,
  );

  return updated;
}

async function resourceExchange(resourceExchange: ResourceExchangeDto) {
  const { communityCenterA, communityCenterB } = resourceExchange;

  const communityCenterAFound = (
    await communityCenterRepository.findById(communityCenterA.id)
  )?.toObject();
  if (!communityCenterAFound) {
    throw new NotFoundError('Community Center not found');
  }

  const communityCenterBFound = (
    await communityCenterRepository.findById(communityCenterB.id)
  )?.toObject();
  if (!communityCenterBFound) {
    throw new NotFoundError('Destiny Community Center not found');
  }

  const occupationPercentageA = calculateOccupationPercentage(
    communityCenterAFound.currentOccupancy,
    communityCenterAFound.maxCapacity,
  );
  const occupationPercentageB = calculateOccupationPercentage(
    communityCenterBFound.currentOccupancy,
    communityCenterBFound.maxCapacity,
  );
  const isExchangePossible = resourcesService.isExchangePossible(
    communityCenterA.resources,
    occupationPercentageA,
    communityCenterB.resources,
    occupationPercentageB,
  );
  if (!isExchangePossible) {
    throw new ConflictError('Exchange not possible');
  }

  // Troca de recursos
  const { updatedResourcesA, updatedResourcesB } =
    resourcesService.exchangeResource(
      communityCenterAFound.resources,
      communityCenterB.resources,
      communityCenterBFound.resources,
      communityCenterA.resources,
    );

  // Atualizar recursos dos centros A e B
  const { aUpdated, bUpdated } =
    await communityCenterRepository.updateResourcesAB(
      communityCenterA.id,
      updatedResourcesA,
      communityCenterB.id,
      updatedResourcesB,
    );
  return { aUpdated, bUpdated };
}

export const communityCenterService = {
  getAll,
  getById,
  create,
  updateCurrentOccupancy,
  resourceExchange,
};
