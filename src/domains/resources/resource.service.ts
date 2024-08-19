import { ResourceEnum, ResourceType } from './resource.schema';

export const resourcePoints: Record<ResourceEnum, number> = {
  [ResourceEnum.Medical]: 4,
  [ResourceEnum.Volunteer]: 3,
  [ResourceEnum.MedicalKit]: 7,
  [ResourceEnum.TransportVehicle]: 5,
  [ResourceEnum.FoodBasket]: 2,
};

export const calculatePoints = (
  resources: Partial<Record<ResourceEnum, number>>,
): number => {
  return Object.entries(resources).reduce((total, [resource, quantity]) => {
    // Garantir que resource seja uma chave válida de resourcePoints
    const validResource = resource as keyof typeof resourcePoints;
    // Garantir que quantity não seja undefined
    const validQuantity = quantity ?? 0;

    return total + resourcePoints[validResource] * validQuantity;
  }, 0);
};

function isExchangePossible(
  resourcesFromA: ResourceType,
  occupationPercentageFromA: number,
  resourcesFromB: ResourceType,
  occupationPercentageFromB: number,
): boolean {
  const centerAPoints = calculatePoints(resourcesFromA);
  const centerBPoints = calculatePoints(resourcesFromB);

  const OVERLOAD_PERCENTAGE = 90;
  const isAOverload = occupationPercentageFromA > OVERLOAD_PERCENTAGE;
  const isBOverload = occupationPercentageFromB > OVERLOAD_PERCENTAGE;

  console.log('centerAPoints', centerAPoints);
  console.log('centerBPoints', centerBPoints);

  // Se A estiver sobrecarregado e B não, permitir a troca com A tendo menos pontos
  if (isAOverload && !isBOverload && centerAPoints <= centerBPoints) {
    return true;
  }

  // Se B estiver sobrecarregado e A não, permitir a troca com B tendo menos pontos
  if (isBOverload && !isAOverload && centerBPoints <= centerAPoints) {
    return true;
  }

  // Nos demais casos, permitir a troca se ambos tiverem a mesma quantidade de pontos
  if (centerAPoints === centerBPoints) {
    return true;
  }

  return false;
}

function addResources(
  resources: ResourceType,
  resourcesToAdd: ResourceType,
): ResourceType {
  const updatedResources: ResourceType = { ...resources };

  for (const [resource, quantity] of Object.entries(resourcesToAdd)) {
    const resourceKey = resource as keyof ResourceType;
    if (quantity !== undefined) {
      updatedResources[resourceKey] =
        (updatedResources[resourceKey] || 0) + quantity;
    }
  }

  return updatedResources;
}

function subtractResources(
  resources: ResourceType,
  resourcesToSubtract: ResourceType,
): ResourceType {
  const updatedResources: ResourceType = { ...resources };

  for (const [resource, quantity] of Object.entries(resourcesToSubtract)) {
    const resourceKey = resource as keyof ResourceType;
    if (quantity !== undefined) {
      updatedResources[resourceKey] = Math.max(
        (updatedResources[resourceKey] || 0) - quantity,
        0,
      );
    }
  }

  return updatedResources;
}

function exchangeResource(
  resourcesFromA: ResourceType,
  resourcesToAddFromB: ResourceType,
  resourcesFromB: ResourceType,
  resourcesToAddFromA: ResourceType,
): { updatedResourcesA: ResourceType; updatedResourcesB: ResourceType } {
  // Atualiza recursos de A e B após troca
  const updatedResourcesA = addResources(
    subtractResources(resourcesFromA, resourcesToAddFromA),
    resourcesToAddFromB,
  );
  const updatedResourcesB = addResources(
    subtractResources(resourcesFromB, resourcesToAddFromB),
    resourcesToAddFromA,
  );

  return {
    updatedResourcesA,
    updatedResourcesB,
  };
}

export const resourcesService = {
  isExchangePossible,
  exchangeResource,
};
