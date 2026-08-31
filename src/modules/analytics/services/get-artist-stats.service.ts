import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractEntity } from '../../sell-contracts/entities/contract.entity';
import { ArtWorkEntity } from '../../works-of-art/entities/art-work.entity';
import { GetUserService } from '../../users/services/get-user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ArtWorkStatusEnum } from '../../../shared/enums/art-work-status.enum';
import { ArtistStatsResponseDto } from '../dto/artist-stats-response.dto';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

@Injectable()
export class GetArtistStatsService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(ArtWorkEntity)
    private readonly artWorkRepository: Repository<ArtWorkEntity>,
    private readonly getUser: GetUserService,
  ) {}

  public async execute(requester: AuthenticatedUser): Promise<ArtistStatsResponseDto> {
    const artistUser = await this.getUser.execute({ id: requester.userId });
    if (artistUser.userRole !== UserRoles.ARTISTE) {
      throw new ForbiddenException('Only an artist can access its own statistics');
    }
    const artist = artistUser.artist;

    const contracts = await this.contractRepository.find({
      where: { artWork: { owner: { id: artist.id } } },
    });

    const availableArtworksCount = await this.artWorkRepository.count({
      where: { owner: { id: artist.id }, status: ArtWorkStatusEnum.AVAILABLE },
    });

    return {
      totalSalesCount: contracts.length,
      totalRevenue: this.sum(contracts, (contract) => contract.artistSold),
      totalCommissionsPaid: this.sum(contracts, (contract) => contract.galleryCommission),
      availableArtworksCount,
    };
  }

  private sum(contracts: ContractEntity[], selector: (contract: ContractEntity) => number): number {
    return (
      Math.round(contracts.reduce((total, contract) => total + selector(contract), 0) * 100) / 100
    );
  }
}
