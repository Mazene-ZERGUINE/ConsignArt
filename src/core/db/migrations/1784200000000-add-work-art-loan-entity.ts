import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWorkArtLoanEntity1784200000000 implements MigrationInterface {
  name = 'AddWorkArtLoanEntity1784200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "work_art_loan_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from" date NOT NULL, "to" date NOT NULL, "conditions" text, "art_work_id" uuid NOT NULL, "from_gallery_id" uuid, "to_gallery_id" uuid, CONSTRAINT "PK_work_art_loan_entity" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_art_loan_entity" ADD CONSTRAINT "FK_work_art_loan_entity_art_work" FOREIGN KEY ("art_work_id") REFERENCES "work_art_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_art_loan_entity" ADD CONSTRAINT "FK_work_art_loan_entity_from_gallery" FOREIGN KEY ("from_gallery_id") REFERENCES "gallery_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_art_loan_entity" ADD CONSTRAINT "FK_work_art_loan_entity_to_gallery" FOREIGN KEY ("to_gallery_id") REFERENCES "gallery_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "work_art_loan_entity" DROP CONSTRAINT "FK_work_art_loan_entity_to_gallery"`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_art_loan_entity" DROP CONSTRAINT "FK_work_art_loan_entity_from_gallery"`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_art_loan_entity" DROP CONSTRAINT "FK_work_art_loan_entity_art_work"`,
    );
    await queryRunner.query(`DROP TABLE "work_art_loan_entity"`);
  }
}
