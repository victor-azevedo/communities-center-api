import { communityCenterRepository } from './community-center.repository';
import { CreateCommunityCenterDto } from './dto/create-community-center.dto';

async function create(dto: CreateCommunityCenterDto) {
  return await communityCenterRepository.create(dto);
}

export const communityCenterService = {
  create,
};
