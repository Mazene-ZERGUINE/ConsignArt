import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../../app.module';
import { UserEntity } from '../../../modules/users/entities/user.entity';
import { ArtWorkEntity } from '../../../modules/works-of-art/entities/art-work.entity';
import { CreateUsersService } from '../../../shared/service/create-users.service';
import { GetUserService } from '../../../modules/users/services/get-user.service';
import { ValidateGalleryAccountService } from '../../../modules/admin/services/validate-gallery-account.service';
import { AddArtistToGalleryService } from '../../../modules/gallery/services/add-artist-to-gallery.service';
import { AddArtworkService } from '../../../modules/artists/services/add-art-work.service';
import { CreateSaleService } from '../../../modules/sell-contracts/services/create-sale.service';
import { CreateExpositionService } from '../../../modules/expositions/services/create-exposition.service';
import { CreateLoanService } from '../../../modules/expositions/loans/services/create-loan.service';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
import { ExpositionTypeEnum } from '../../../shared/enums/exposition-type.enum';
import { CreateArtWorkDto } from '../../../modules/works-of-art/dto/create-art-work.dto';

const SEED_PASSWORD = 'Password#2026';
const logger = new Logger('Seed');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const dataSource = app.get(DataSource);
  const alreadySeeded = await dataSource
    .getRepository(UserEntity)
    .findOneBy({ email: 'admin@consignart.test' });

  if (alreadySeeded) {
    logger.warn('Seed data already present (admin@consignart.test exists), skipping.');
    await app.close();
    return;
  }

  const createUsers = app.get(CreateUsersService);
  const getUser = app.get(GetUserService);
  const validateGalleryAccount = app.get(ValidateGalleryAccountService);
  const addArtistToGallery = app.get(AddArtistToGalleryService);
  const addArtwork = app.get(AddArtworkService);
  const createSale = app.get(CreateSaleService);
  const createExposition = app.get(CreateExpositionService);
  const createLoan = app.get(CreateLoanService);

  logger.log('Creating admin account…');
  const adminUser = await createUsers.execute({
    email: 'admin@consignart.test',
    password: SEED_PASSWORD,
    userRole: UserRoles.ADMIN,
  });

  logger.log('Creating gallery accounts…');
  const galleryAUser = await createUsers.execute({
    email: 'gallery.a@consignart.test',
    password: SEED_PASSWORD,
    userRole: UserRoles.GALLERY,
    galleryName: 'Aurora Fine Arts',
  });
  const galleryBUser = await createUsers.execute({
    email: 'gallery.b@consignart.test',
    password: SEED_PASSWORD,
    userRole: UserRoles.GALLERY,
    galleryName: 'Nova Contemporary',
  });
  await createUsers.execute({
    email: 'gallery.c@consignart.test',
    password: SEED_PASSWORD,
    userRole: UserRoles.GALLERY,
    galleryName: 'Pending Gallery',
  });

  logger.log('Validating gallery A and B…');
  await validateGalleryAccount.execute(galleryAUser.userId, adminUser.userId);
  await validateGalleryAccount.execute(galleryBUser.userId, adminUser.userId);

  logger.log('Creating collector accounts…');
  const collector1 = await createUsers.execute({
    email: 'collector.1@consignart.test',
    password: SEED_PASSWORD,
    userRole: UserRoles.COLLECTOR,
  });
  await createUsers.execute({
    email: 'collector.2@consignart.test',
    password: SEED_PASSWORD,
    userRole: UserRoles.COLLECTOR,
  });
  const collector1Profile = await getUser.execute({ id: collector1.userId });
  if (collector1Profile.userRole !== UserRoles.COLLECTOR) {
    throw new Error('Seeded collector 1 account was not created as a collector');
  }

  logger.log('Attaching artists to galleries…');
  await addArtistToGallery.execute(galleryAUser.userId, {
    createUserDto: {
      email: 'artist.elena@consignart.test',
      password: SEED_PASSWORD,
      userRole: UserRoles.ARTISTE,
    },
    firstName: 'Elena',
    lastName: 'Voss',
    bio: 'Painter exploring light and stillness in large-scale canvases.',
    portfolioUrl: 'https://portfolio.example.com/elena-voss',
    nationality: 'German',
  });
  await addArtistToGallery.execute(galleryAUser.userId, {
    createUserDto: {
      email: 'artist.marcus@consignart.test',
      password: SEED_PASSWORD,
      userRole: UserRoles.ARTISTE,
    },
    firstName: 'Marcus',
    lastName: 'Lee',
    bio: 'Sculptor working with reclaimed steel and glass.',
    portfolioUrl: 'https://portfolio.example.com/marcus-lee',
    nationality: 'Canadian',
  });
  await addArtistToGallery.execute(galleryBUser.userId, {
    createUserDto: {
      email: 'artist.sofia@consignart.test',
      password: SEED_PASSWORD,
      userRole: UserRoles.ARTISTE,
    },
    firstName: 'Sofia',
    lastName: 'Idris',
    bio: 'Photographer documenting coastal cities at dawn.',
    portfolioUrl: 'https://portfolio.example.com/sofia-idris',
    nationality: 'Tunisian',
  });

  const elenaUser = await getUser.execute({ email: 'artist.elena@consignart.test' });
  const marcusUser = await getUser.execute({ email: 'artist.marcus@consignart.test' });
  const sofiaUser = await getUser.execute({ email: 'artist.sofia@consignart.test' });

  logger.log('Creating art works…');
  const artwork = (overrides: Partial<CreateArtWorkDto>): CreateArtWorkDto => ({
    title: 'Untitled',
    description: 'Seed art work for local testing.',
    creationYear: '2024',
    technique: 'oil',
    sellingPrice: 3000,
    reservationPrice: 2000,
    imageUrl: 'https://picsum.photos/seed/consignart/800/600',
    ...overrides,
  });

  await addArtwork.execute(
    elenaUser.userId,
    artwork({
      title: 'Quiet Horizon',
      technique: 'oil',
      sellingPrice: 3000,
      reservationPrice: 2000,
      imageUrl: 'https://picsum.photos/seed/quiet-horizon/800/600',
    }),
  );
  await addArtwork.execute(
    elenaUser.userId,
    artwork({
      title: 'Autumn Drift',
      technique: 'oil',
      sellingPrice: 12000,
      reservationPrice: 9000,
      imageUrl: 'https://picsum.photos/seed/autumn-drift/800/600',
    }),
  );
  await addArtwork.execute(
    marcusUser.userId,
    artwork({
      title: 'Steel Bloom',
      technique: 'sculpture',
      sellingPrice: 30000,
      reservationPrice: 25000,
      imageUrl: 'https://picsum.photos/seed/steel-bloom/800/600',
    }),
  );
  await addArtwork.execute(
    marcusUser.userId,
    artwork({
      title: 'Glass Current',
      technique: 'sculpture',
      sellingPrice: 8000,
      reservationPrice: 6000,
      imageUrl: 'https://picsum.photos/seed/glass-current/800/600',
    }),
  );
  await addArtwork.execute(
    sofiaUser.userId,
    artwork({
      title: 'Harbor Light',
      technique: 'photography',
      sellingPrice: 5000,
      reservationPrice: 4000,
      imageUrl: 'https://picsum.photos/seed/harbor-light/800/600',
    }),
  );
  await addArtwork.execute(
    sofiaUser.userId,
    artwork({
      title: 'Northern Drift',
      technique: 'photography',
      sellingPrice: 15000,
      reservationPrice: 10000,
      imageUrl: 'https://picsum.photos/seed/northern-drift/800/600',
    }),
  );

  const galleryARequester = {
    userId: galleryAUser.userId,
    email: galleryAUser.email,
    role: UserRoles.GALLERY,
  };

  const elenaArtworks = await getArtWorksByTitle(dataSource, ['Quiet Horizon', 'Autumn Drift']);
  const marcusArtworks = await getArtWorksByTitle(dataSource, ['Steel Bloom', 'Glass Current']);

  logger.log('Recording a sale (Quiet Horizon -> collector 1)…');
  await createSale.execute(galleryARequester, {
    artWorkId: elenaArtworks['Quiet Horizon'],
    buyerId: collector1Profile.collector.id,
  });

  logger.log('Organizing an exposition (Spring Selects)…');
  await createExposition.execute(galleryARequester, {
    name: 'Spring Selects',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    expositionType: ExpositionTypeEnum.ON_SITE,
    address: '12 Rue des Beaux-Arts',
    zipCode: '75006',
    city: 'Paris',
    artWorkIds: [elenaArtworks['Autumn Drift'], marcusArtworks['Steel Bloom']],
  });

  const galleryBProfile = await getUser.execute({ id: galleryBUser.userId });
  if (galleryBProfile.userRole !== UserRoles.GALLERY) {
    throw new Error('Seeded gallery B account was not created as a gallery');
  }

  logger.log('Lending Glass Current to gallery B…');
  await createLoan.execute(galleryARequester, {
    artWorkId: marcusArtworks['Glass Current'],
    toGalleryId: galleryBProfile.gallery.id,
    from: '2026-04-01',
    to: '2026-04-30',
    conditions: 'Climate controlled transport, insured for full value.',
  });

  logger.log('Seed complete. Seeded accounts (password for all: ' + SEED_PASSWORD + '):');
  logger.log('  admin: admin@consignart.test');
  logger.log('  gallery (validated): gallery.a@consignart.test, gallery.b@consignart.test');
  logger.log('  gallery (pending validation): gallery.c@consignart.test');
  logger.log('  artists: artist.elena@consignart.test, artist.marcus@consignart.test, artist.sofia@consignart.test');
  logger.log('  collectors: collector.1@consignart.test, collector.2@consignart.test');

  await app.close();
}

async function getArtWorksByTitle(
  dataSource: DataSource,
  titles: string[],
): Promise<Record<string, string>> {
  const rows = await dataSource.getRepository(ArtWorkEntity).find({ where: titles.map((title) => ({ title })) });

  return Object.fromEntries(rows.map((row) => [row.title, row.id]));
}

bootstrap().catch((error: unknown) => {
  logger.error('Seed failed', error instanceof Error ? error.stack : error);
  process.exit(1);
});
