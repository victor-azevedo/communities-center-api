import { CommunityCenterModel } from './community-center.model';
import { CreateCommunityCenterDto } from './dto/create-community-center.dto';

async function create(dto: CreateCommunityCenterDto) {
  return await CommunityCenterModel.create(dto);
}

export const communityCenterRepository = {
  create,
};
