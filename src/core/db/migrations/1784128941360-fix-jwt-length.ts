import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixJwtLength1784128941360 implements MigrationInterface {
  name = 'FixJwtLength1784128941360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "refresh_tokens_entity"`);

    await queryRunner.query(
      `ALTER TABLE "refresh_tokens_entity" DROP CONSTRAINT "UQ_d3bcf8afb939997eb4da25fdc2f"`,
    );
    await queryRunner.query(`ALTER TABLE "refresh_tokens_entity" DROP COLUMN "hashed_token"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens_entity" ADD "hashed_token" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens_entity" ADD CONSTRAINT "UQ_d3bcf8afb939997eb4da25fdc2f" UNIQUE ("hashed_token")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "refresh_tokens_entity"`);

    await queryRunner.query(
      `ALTER TABLE "refresh_tokens_entity" DROP CONSTRAINT "UQ_d3bcf8afb939997eb4da25fdc2f"`,
    );
    await queryRunner.query(`ALTER TABLE "refresh_tokens_entity" DROP COLUMN "hashed_token"`);
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens_entity" ADD "hashed_token" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens_entity" ADD CONSTRAINT "UQ_d3bcf8afb939997eb4da25fdc2f" UNIQUE ("hashed_token")`,
    );
  }
}
