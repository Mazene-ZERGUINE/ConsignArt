import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { WorkArtLoanEntity } from '../../../works-of-art/entities/work-art-load.entity';
import { LoanResponseDto } from '../dto/loan-response.dto';
import { LoadedLoan, toLoanDto } from '../mappers/loan.mapper';
import { UserRoles } from '../../../../shared/enums/user-roles.enum';
import { type AuthenticatedUser } from '../../../../core/types/authenticated-user.types';

const LOAN_RELATIONS = {
  workArt: { owner: { user: true } },
  fromGallery: { user: true },
  toGallery: { user: true },
} as const;

@Injectable()
export class GetLoansService {
  constructor(
    @InjectRepository(WorkArtLoanEntity)
    private readonly loanRepository: Repository<WorkArtLoanEntity>,
  ) {}

  public async list(requester: AuthenticatedUser): Promise<LoanResponseDto[]> {
    const scope = this.buildScope(requester);
    if (scope === null) return [];

    const loans = (await this.loanRepository.find({
      where: scope,
      relations: LOAN_RELATIONS,
    })) as LoadedLoan[];

    return loans.map(toLoanDto);
  }

  public async getOne(id: string): Promise<LoanResponseDto> {
    const loan = (await this.loanRepository.findOne({
      where: { id },
      relations: LOAN_RELATIONS,
    })) as LoadedLoan | null;

    if (!loan) throw new NotFoundException('Loan not found');

    return toLoanDto(loan);
  }

  private buildScope(
    requester: AuthenticatedUser,
  ): FindOptionsWhere<WorkArtLoanEntity>[] | FindOptionsWhere<WorkArtLoanEntity> | null {
    switch (requester.role) {
      case UserRoles.GALLERY:
        return [
          { fromGallery: { user: { userId: requester.userId } } },
          { toGallery: { user: { userId: requester.userId } } },
        ];
      case UserRoles.ARTISTE:
        return { workArt: { owner: { user: { userId: requester.userId } } } };
      case UserRoles.COLLECTOR:
        return null;
      default:
        return {};
    }
  }
}
