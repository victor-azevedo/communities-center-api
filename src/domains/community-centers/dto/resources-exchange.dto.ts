import Joi from 'joi';
import { resourceDtoSchema } from '../../resources/dto/resource.dto';
import { ResourceType } from '../../resources/resource.schema';

export type ResourceExchangeDto = {
  communityCenterA: {
    id: string;
    resources: ResourceType;
  };
  communityCenterB: {
    id: string;
    resources: ResourceType;
  };
};

export const resourceExchangeDtoSchema = Joi.object<ResourceExchangeDto>({
  communityCenterA: Joi.object({
    id: Joi.string().required().messages({
      'string.base': 'Community Center Origin ID must be a string.',
      'any.required': 'Community Center Origin ID is required.',
    }),
    resources: resourceDtoSchema,
  })
    .required()
    .messages({
      'object.base': 'Community Center Origin must be an object.',
      'any.required': 'Community Center Origin is required.',
    }),
  communityCenterB: Joi.object({
    id: Joi.string().required().messages({
      'string.base': 'Community Center Destination ID must be a string.',
      'any.required': 'Community Center Destination ID is required.',
    }),
    resources: resourceDtoSchema,
  })
    .required()
    .messages({
      'object.base': 'Community Center Destination must be an object.',
      'any.required': 'Community Center Destination is required.',
    }),
});
