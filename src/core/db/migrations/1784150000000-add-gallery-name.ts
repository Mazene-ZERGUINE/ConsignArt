import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGalleryName1784150000000 implements MigrationInterface {
  name = 'AddGalleryName1784150000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_entity" ADD "name" character varying(255)`);
    await queryRunner.query(
      `UPDATE "gallery_entity" g SET "name" = u."email" FROM "users_entity" u WHERE u."userId" = g."user_id" AND g."name" IS NULL`,
    );

    await queryRunner.query(`ALTER TABLE "gallery_entity" ALTER COLUMN "name" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gallery_entity" DROP COLUMN "name"`);
  }
}
