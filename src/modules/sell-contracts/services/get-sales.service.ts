import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ContractEntity } from '../entities/contract.entity';
import { SaleResponseDto } from '../dto/sale-response.dto';
import { LoadedContract, toSaleDto } from '../mappers/sale.mapper';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';

const SALE_RELATIONS = {
  artWork: { owner: { user: true }, gallery: { user: true } },
  buyer: { user: true },
  invoice: true,
  receipt: true,
} as const;

@Injectable()
export class GetSalesService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
  ) {}

  public async list(requester: AuthenticatedUser): Promise<SaleResponseDto[]> {
    const contracts = (await this.contractRepository.find({
      where: this.buildScope(requester),
      relations: SALE_RELATIONS,
    })) as LoadedContract[];

    return contracts.map(toSaleDto);
  }

  public async getOne(requester: AuthenticatedUser, id: string): Promise<SaleResponseDto> {
    const contract = (await this.contractRepository.findOne({
      where: { id, ...this.buildScope(requester) },
      relations: SALE_RELATIONS,
    })) as LoadedContract | null;

    if (!contract) throw new NotFoundException('Sale not found');

    return toSaleDto(contract);
  }

  private buildScope(requester: AuthenticatedUser): FindOptionsWhere<ContractEntity> {
    switch (requester.role) {
      case UserRoles.GALLERY:
        return { artWork: { gallery: { user: { userId: requester.userId } } } };
      case UserRoles.ARTISTE:
        return { artWork: { owner: { user: { userId: requester.userId } } } };
      case UserRoles.COLLECTOR:
        return { buyer: { user: { userId: requester.userId } } };
      default:
        return {};
    }
  }
}
