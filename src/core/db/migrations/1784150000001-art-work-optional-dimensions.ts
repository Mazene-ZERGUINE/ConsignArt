import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArtWorkOptionalDimensions1784150000001 implements MigrationInterface {
  name = 'ArtWorkOptionalDimensions1784150000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "work_art_entity" ALTER COLUMN "height" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "work_art_entity" ALTER COLUMN "width" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "work_art_entity" ALTER COLUMN "width" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "work_art_entity" ALTER COLUMN "height" SET NOT NULL`);
  }
}
