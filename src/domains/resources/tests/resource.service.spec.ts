import { ResourceEnum, ResourceType } from '../resource.schema';
import {
  calculatePoints,
  resourcePoints,
  resourcesService,
} from '../resource.service';

describe('[ResourceService] resourcePoints', () => {
  it('should have the correct points for each resource', () => {
    expect(resourcePoints[ResourceEnum.Medical]).toBe(4);
    expect(resourcePoints[ResourceEnum.Volunteer]).toBe(3);
    expect(resourcePoints[ResourceEnum.MedicalKit]).toBe(7);
    expect(resourcePoints[ResourceEnum.TransportVehicle]).toBe(5);
    expect(resourcePoints[ResourceEnum.FoodBasket]).toBe(2);
  });
});

describe('[ResourceService] calculatePoints', () => {
  it('should calculate the total points correctly', () => {
    const resources: Partial<Record<ResourceEnum, number>> = {
      [ResourceEnum.Medical]: 2,
      [ResourceEnum.Volunteer]: 1,
      [ResourceEnum.MedicalKit]: 3,
      [ResourceEnum.TransportVehicle]: 1,
      [ResourceEnum.FoodBasket]: 2,
    };

    const result = calculatePoints(resources);

    expect(result).toBe(4 * 2 + 3 * 1 + 7 * 3 + 5 * 1 + 2 * 2);
  });

  it('should handle undefined quantities correctly', () => {
    const resources: Partial<Record<ResourceEnum, number>> = {
      [ResourceEnum.Medical]: undefined,
      [ResourceEnum.Volunteer]: 2,
      [ResourceEnum.MedicalKit]: undefined,
      [ResourceEnum.TransportVehicle]: 1,
      [ResourceEnum.FoodBasket]: undefined,
    };

    const result = calculatePoints(resources);

    expect(result).toBe(3 * 2 + 5 * 1);
  });

  it('should return 0 when no resources are provided', () => {
    const resources: Partial<Record<ResourceEnum, number>> = {};

    const result = calculatePoints(resources);

    expect(result).toBe(0);
  });
});

describe('[ResourceService] isExchangePossible', () => {
  it('should return true when A is overloaded and B is not, and A has fewer points', () => {
    const resourcesFromA: ResourceType = {
      [ResourceEnum.Medical]: 2,
      [ResourceEnum.Volunteer]: 1,
    };
    const occupationPercentageFromA = 95;
    const resourcesFromB: ResourceType = {
      [ResourceEnum.Medical]: 3,
      [ResourceEnum.Volunteer]: 2,
    };
    const occupationPercentageFromB = 80;

    const result = resourcesService.isExchangePossible(
      resourcesFromA,
      occupationPercentageFromA,
      resourcesFromB,
      occupationPercentageFromB,
    );

    expect(result).toBe(true);
  });

  it('should return true when B is overloaded and A is not, and B has fewer points', () => {
    const resourcesFromA: ResourceType = {
      [ResourceEnum.Medical]: 3,
      [ResourceEnum.Volunteer]: 2,
    };
    const occupationPercentageFromA = 80;
    const resourcesFromB: ResourceType = {
      [ResourceEnum.Medical]: 2,
      [ResourceEnum.Volunteer]: 1,
    };
    const occupationPercentageFromB = 95;

    const result = resourcesService.isExchangePossible(
      resourcesFromA,
      occupationPercentageFromA,
      resourcesFromB,
      occupationPercentageFromB,
    );

    expect(result).toBe(true);
  });

  it('should return true when both A and B have the same number of points', () => {
    const resourcesFromA: ResourceType = {
      [ResourceEnum.Medical]: 2,
      [ResourceEnum.Volunteer]: 1,
    };
    const occupationPercentageFromA = 80;
    const resourcesFromB: ResourceType = {
      [ResourceEnum.Medical]: 2,
      [ResourceEnum.Volunteer]: 1,
    };
    const occupationPercentageFromB = 80;

    const result = resourcesService.isExchangePossible(
      resourcesFromA,
      occupationPercentageFromA,
      resourcesFromB,
      occupationPercentageFromB,
    );

    expect(result).toBe(true);
  });

  it('should return false when A is overloaded and B is not, but A has more points', () => {
    const resourcesFromA: ResourceType = {
      [ResourceEnum.Medical]: 4,
      [ResourceEnum.Volunteer]: 2,
    };
    const occupationPercentageFromA = 95;
    const resourcesFromB: ResourceType = {
      [ResourceEnum.Medical]: 3,
      [ResourceEnum.Volunteer]: 1,
    };
    const occupationPercentageFromB = 80;

    const result = resourcesService.isExchangePossible(
      resourcesFromA,
      occupationPercentageFromA,
      resourcesFromB,
      occupationPercentageFromB,
    );

    expect(result).toBe(false);
  });

  it('should return false when B is overloaded and A is not, but B has more points', () => {
    const resourcesFromA: ResourceType = {
      [ResourceEnum.Medical]: 3,
      [ResourceEnum.Volunteer]: 1,
    };
    const occupationPercentageFromA = 80;
    const resourcesFromB: ResourceType = {
      [ResourceEnum.Medical]: 4,
      [ResourceEnum.Volunteer]: 2,
    };
    const occupationPercentageFromB = 95;

    const result = resourcesService.isExchangePossible(
      resourcesFromA,
      occupationPercentageFromA,
      resourcesFromB,
      occupationPercentageFromB,
    );

    expect(result).toBe(false);
  });
});
