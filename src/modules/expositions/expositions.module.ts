import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtWorkEntity } from '../works-of-art/entities/art-work.entity';
import { ArtWorkTransferHistoryEntity } from '../works-of-art/entities/art-work-transfer-history.entity';
import { WorkArtLoanEntity } from '../works-of-art/entities/work-art-load.entity';
import { GalleryEntity } from '../gallery/entities/gallery.entity';
import { ExpositionEntity } from './entities/exposition.entity';
import { UsersModule } from '../users/users.module';
import { CreateExpositionService } from './services/create-exposition.service';
import { GetExpositionService } from './services/get-exposition.service';
import { UpdateExpositionService } from './services/update-exposition.service';
import { CloseExpositionService } from './services/close-exposition.service';
import { ExpositionsController } from './expositions.controller';
import { CreateLoanService } from './loans/services/create-loan.service';
import { GetLoansService } from './loans/services/get-loans.service';
import { LoansController } from './loans/loans.controller';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      ExpositionEntity,
      ArtWorkEntity,
      ArtWorkTransferHistoryEntity,
      WorkArtLoanEntity,
      GalleryEntity,
    ]),
  ],
  providers: [
    CreateExpositionService,
    GetExpositionService,
    UpdateExpositionService,
    CloseExpositionService,
    CreateLoanService,
    GetLoansService,
  ],
  controllers: [ExpositionsController, LoansController],
})
export class ExpositionsModule {}
