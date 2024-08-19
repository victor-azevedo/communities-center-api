import { ConflictError, NotFoundError } from '../../../errors';
import { communityCenterRepository } from '../community-center.repository';
import { communityCenterService } from '../community-center.service';

describe('communityCenterService', () => {
  describe('updateCurrentOccupancy', () => {
    it('should update the current occupancy and return the updated community center', async () => {
      const id = '1';
      const currentOccupancy = 50;
      const maxCapacity = 100;
      const communityCenter = {
        id,
        maxCapacity,
        currentOccupancy: 0,
      };

      communityCenterRepository.findById = jest
        .fn()
        .mockResolvedValue(communityCenter);
      communityCenterRepository.updateCurrentOccupancy = jest
        .fn()
        .mockResolvedValue(communityCenter);

      const updated = await communityCenterService.updateCurrentOccupancy(
        id,
        currentOccupancy,
      );

      expect(communityCenterRepository.findById).toHaveBeenCalledWith(id);
      expect(
        communityCenterRepository.updateCurrentOccupancy,
      ).toHaveBeenCalledWith(id, currentOccupancy);
      expect(updated).toEqual(communityCenter);
    });

    it('should throw a NotFoundError if the community center is not found', async () => {
      const id = '1';
      const currentOccupancy = 50;

      communityCenterRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(
        communityCenterService.updateCurrentOccupancy(id, currentOccupancy),
      ).rejects.toThrow(NotFoundError);
      expect(communityCenterRepository.findById).toHaveBeenCalledWith(id);
    });

    it('should throw a ConflictError if the current occupancy is greater than the max capacity', async () => {
      const id = '1';
      const currentOccupancy = 150;
      const maxCapacity = 100;
      const communityCenter = {
        id,
        maxCapacity,
        currentOccupancy: 0,
      };

      communityCenterRepository.findById = jest
        .fn()
        .mockResolvedValue(communityCenter);

      await expect(
        communityCenterService.updateCurrentOccupancy(id, currentOccupancy),
      ).rejects.toThrow(ConflictError);
      expect(communityCenterRepository.findById).toHaveBeenCalledWith(id);
    });
  });
});
