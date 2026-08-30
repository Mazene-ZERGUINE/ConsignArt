import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractEntity } from '../../sell-contracts/entities/contract.entity';
import { ArtWorkEntity } from '../../works-of-art/entities/art-work.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { GetUserService } from '../../users/services/get-user.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { GalleryStatsResponseDto, TopArtistDto } from '../dto/gallery-stats-response.dto';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

const TOP_ARTISTS_LIMIT = 5;

type LoadedContract = ContractEntity & { artWork: ArtWorkEntity & { owner: ArtistEntity } };

@Injectable()
export class GetGalleryStatsService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(ArtWorkEntity)
    private readonly artWorkRepository: Repository<ArtWorkEntity>,
    private readonly getUser: GetUserService,
  ) {}

  public async execute(requester: AuthenticatedUser): Promise<GalleryStatsResponseDto> {
    const galleryUser = await this.getUser.execute({ id: requester.userId });
    if (galleryUser.userRole !== UserRoles.GALLERY) {
      throw new ForbiddenException('Only a gallery can access its own statistics');
    }
    const gallery = galleryUser.gallery;

    const contracts = (await this.contractRepository.find({
      where: { artWork: { gallery: { id: gallery.id } } },
      relations: { artWork: { owner: true } },
    })) as LoadedContract[];

    const totalArtworksCount = await this.artWorkRepository.count({
      where: { gallery: { id: gallery.id } },
    });

    return {
      artworksSoldByMonth: this.groupByMonth(contracts),
      totalSalesRevenue: this.sum(contracts, (contract) => contract.sellingPrice),
      totalGalleryCommission: this.sum(contracts, (contract) => contract.galleryCommission),
      topArtists: this.topArtists(contracts),
      rotationRate: totalArtworksCount > 0 ? contracts.length / totalArtworksCount : 0,
    };
  }

  private sum(contracts: ContractEntity[], selector: (contract: ContractEntity) => number): number {
    return Math.round(contracts.reduce((total, contract) => total + selector(contract), 0) * 100) / 100;
  }

  private groupByMonth(contracts: LoadedContract[]): GalleryStatsResponseDto['artworksSoldByMonth'] {
    const counts = new Map<string, number>();
    for (const contract of contracts) {
      const month = new Date(contract.sellingDate).toISOString().slice(0, 7);
      counts.set(month, (counts.get(month) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private topArtists(contracts: LoadedContract[]): TopArtistDto[] {
    const salesByArtist = new Map<string, TopArtistDto>();
    for (const contract of contracts) {
      const artist = contract.artWork.owner;
      const existing = salesByArtist.get(artist.id);
      if (existing) {
        existing.salesCount += 1;
      } else {
        salesByArtist.set(artist.id, {
          artistId: artist.id,
          firstName: artist.firstName,
          lastName: artist.lastName,
          salesCount: 1,
        });
      }
    }
    return Array.from(salesByArtist.values())
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, TOP_ARTISTS_LIMIT);
  }
}
