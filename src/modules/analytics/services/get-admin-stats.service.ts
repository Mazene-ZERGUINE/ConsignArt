import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractEntity } from '../../sell-contracts/entities/contract.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { GalleryEntity } from '../../gallery/entities/gallery.entity';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ActivityStatusEnum } from '../../../shared/enums/activity-status.enum';
import { AdminStatsResponseDto } from '../dto/admin-stats-response.dto';

@Injectable()
export class GetAdminStatsService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ArtistEntity)
    private readonly artistRepository: Repository<ArtistEntity>,
    @InjectRepository(GalleryEntity)
    private readonly galleryRepository: Repository<GalleryEntity>,
  ) {}

  public async execute(): Promise<AdminStatsResponseDto> {
    const contracts = await this.contractRepository.find();

    const [activeArtists, validatedGalleries, collectors, admins] = await Promise.all([
      this.artistRepository.count({ where: { status: ActivityStatusEnum.ACTIVE } }),
      this.galleryRepository.count({ where: { isValidated: true } }),
      this.userRepository.count({ where: { userRole: UserRoles.COLLECTOR } }),
      this.userRepository.count({ where: { userRole: UserRoles.ADMIN } }),
    ]);

    return {
      activeUsersCount: activeArtists + validatedGalleries + collectors + admins,
      transactionsCount: contracts.length,
      transactionsVolume: this.sum(contracts, (contract) => contract.sellingPrice),
      totalPlatformCommissions: this.sum(contracts, (contract) => contract.galleryCommission),
    };
  }

  private sum(contracts: ContractEntity[], selector: (contract: ContractEntity) => number): number {
    return (
      Math.round(contracts.reduce((total, contract) => total + selector(contract), 0) * 100) / 100
    );
  }
}
