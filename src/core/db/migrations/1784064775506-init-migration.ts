import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1784064775506 implements MigrationInterface {
  name = 'InitMigration1784064775506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transfer_request_entity_request_status_enum" AS ENUM('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transfer_request_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transfer_reason" text NOT NULL, "request_status" "public"."transfer_request_entity_request_status_enum" NOT NULL DEFAULT 'pending', "artist_to_transfer_id" uuid, "from_gallery_id" uuid, "to_gallery_id" uuid NOT NULL, "initiated_by_artist_id" uuid, CONSTRAINT "PK_29d589e27350953cf6a9eec7764" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."exposition_entity_type_enum" AS ENUM('virtual', 'on_site')`,
    );
    await queryRunner.query(
      `CREATE TABLE "exposition_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "type" "public"."exposition_entity_type_enum" NOT NULL, "address" character varying, "zip_code" character varying(5), "city" character varying, "virtual_link" character varying, "gallery_id" uuid NOT NULL, CONSTRAINT "PK_9684aa145c0826d26ad23a33056" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."work_art_entity_status_enum" AS ENUM('on_loan', 'available', 'sold', 'returned')`,
    );
    await queryRunner.query(
      `CREATE TABLE "work_art_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(60) NOT NULL, "description" character varying(255) NOT NULL, "creation_year" character varying(4) NOT NULL, "technique" character varying NOT NULL, "height" numeric(10,2) NOT NULL, "width" numeric(10,2) NOT NULL, "depth" numeric(10,2), "selling_price" numeric(12,2) NOT NULL, "reservation_price" numeric(12,2) NOT NULL, "status" "public"."work_art_entity_status_enum" NOT NULL DEFAULT 'available', "imageUrl" character varying NOT NULL, "submit_date" date NOT NULL, "ownerId" uuid, "gallery_id" uuid NOT NULL, CONSTRAINT "PK_26e2be5b77e14b9124f39140a31" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d52275042733d239732229cd69" ON "work_art_entity"  ("status") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."artist_entity_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "artist_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(255), "last_name" character varying(255), "bio" text, "portfolio_url" character varying, "nationality" character varying(60), "status" "public"."artist_entity_status_enum" NOT NULL DEFAULT 'active', "joined_gallery_at" date, "galleryId" uuid, "user_id" uuid, CONSTRAINT "REL_bb375ccf10e0fd167218e0191c" UNIQUE ("user_id"), CONSTRAINT "PK_c6ec16b57b60c8096406808021d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, CONSTRAINT "REL_83850227cd76dd87782845b2a0" UNIQUE ("user_id"), CONSTRAINT "PK_bc992df5ddb70aefb955b8a0c92" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gallery_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_validated" boolean NOT NULL DEFAULT false, "validated_at" date, "validated_by_admin_id" uuid, "user_id" uuid NOT NULL, CONSTRAINT "REL_aba161015514d2cd6aad3ad665" UNIQUE ("user_id"), CONSTRAINT "PK_28d8911f39e9d18d8d52da96f14" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contract_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "selling_price" numeric(12,2) NOT NULL, "selling_date" date NOT NULL DEFAULT now(), "gallery_commission" numeric(12,2) NOT NULL, "artist_sold" numeric(12,2) NOT NULL, "art_work_id" uuid, "buyer_id" uuid, CONSTRAINT "REL_2e3ea425af36ccd33242e6e24d" UNIQUE ("art_work_id"), CONSTRAINT "PK_7575db328609620b41aa3ada0c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "collector_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(255), "last_name" character varying(255), "user_id" uuid, CONSTRAINT "REL_ed99e234a0551847b5ae7b3e64" UNIQUE ("user_id"), CONSTRAINT "PK_6c17efbb3034076616495447e01" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_entity_userrole_enum" AS ENUM('admin', 'gallery', 'artiste', 'collector')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_entity" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "hashed_password" character varying(255) NOT NULL, "userRole" "public"."users_entity_userrole_enum" NOT NULL DEFAULT 'collector', CONSTRAINT "UQ_afcd3ae9dbf45eced5872ca49b0" UNIQUE ("email"), CONSTRAINT "PK_7aa9786b01361e6361c3f519c69" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hashed_token" character varying(255) NOT NULL, "is_revoked" boolean NOT NULL DEFAULT false, "expires_at" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "UQ_d3bcf8afb939997eb4da25fdc2f" UNIQUE ("hashed_token"), CONSTRAINT "PK_1bc7886ac21223c57ceec2b8b98" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."art_work_transfer_history_entity_current_status_enum" AS ENUM('on_loan', 'available', 'sold', 'returned')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."art_work_transfer_history_entity_new_status_enum" AS ENUM('on_loan', 'available', 'sold', 'returned')`,
    );
    await queryRunner.query(
      `CREATE TABLE "art_work_transfer_history_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "current_status" "public"."art_work_transfer_history_entity_current_status_enum" NOT NULL, "new_status" "public"."art_work_transfer_history_entity_new_status_enum" NOT NULL, "is_loaned" boolean NOT NULL, "status_change_date" TIMESTAMP NOT NULL DEFAULT now(), "art_work_id" uuid NOT NULL, "from_gallery_id" uuid, "to_gallery_id" uuid, CONSTRAINT "PK_4fd706af5e494222711b548caa4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "receipt_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contract_id" uuid, CONSTRAINT "REL_1a3b9986f34922216d838a5bb4" UNIQUE ("contract_id"), CONSTRAINT "PK_9e35eb3a8cb152eace0f149242a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric(12,2) NOT NULL, "contract_id" uuid, CONSTRAINT "REL_1fbe0c0b21052285b13ea277bc" UNIQUE ("contract_id"), CONSTRAINT "PK_276fe1a123e3f68d3f7951cf075" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "art_work_exposition_entity" ("expositionEntityId" uuid NOT NULL, "workArtEntityId" uuid NOT NULL, CONSTRAINT "PK_4aba247ccffd4757adb5a964e13" PRIMARY KEY ("expositionEntityId", "workArtEntityId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_40b69446506631ee0a770288a1" ON "art_work_exposition_entity"  ("expositionEntityId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a54a12f8d11cea15355389e7e8" ON "art_work_exposition_entity"  ("workArtEntityId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_request_entity" ADD CONSTRAINT "FK_2f2565375e8f5ef6b10b818e202" FOREIGN KEY ("artist_to_transfer_id") REFERENCES "artist_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_request_entity" ADD CONSTRAINT "FK_133522bdc70918b6bb1de8c75e0" FOREIGN KEY ("from_gallery_id") REFERENCES "gallery_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_request_entity" ADD CONSTRAINT "FK_426efdb09f293076033ff1df0e5" FOREIGN KEY ("to_gallery_id") REFERENCES "gallery_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_request_entity" ADD CONSTRAINT "FK_39b222a1a69d99cf602b84b5d11" FOREIGN KEY ("initiated_by_artist_id") REFERENCES "artist_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exposition_entity" ADD CONSTRAINT "FK_ec311ee7851718e45ef1993d9a5" FOREIGN KEY ("gallery_id") REFERENCES "gallery_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_art_entity" ADD CONSTRAINT "FK_d0e102c3d5c15b8df2b823b21e7" FOREIGN KEY ("ownerId") REFERENCES "artist_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_art_entity" ADD CONSTRAINT "FK_6ece816401b84636a9eef883b85" FOREIGN KEY ("gallery_id") REFERENCES "gallery_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "artist_entity" ADD CONSTRAINT "FK_09243afc810634d49763066fb27" FOREIGN KEY ("galleryId") REFERENCES "gallery_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "artist_entity" ADD CONSTRAINT "FK_bb375ccf10e0fd167218e0191c4" FOREIGN KEY ("user_id") REFERENCES "users_entity"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_entity" ADD CONSTRAINT "FK_83850227cd76dd87782845b2a01" FOREIGN KEY ("user_id") REFERENCES "users_entity"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gallery_entity" ADD CONSTRAINT "FK_b8c89bf9f8463c9cac1f5f569b9" FOREIGN KEY ("validated_by_admin_id") REFERENCES "admin_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gallery_entity" ADD CONSTRAINT "FK_aba161015514d2cd6aad3ad665f" FOREIGN KEY ("user_id") REFERENCES "users_entity"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_entity" ADD CONSTRAINT "FK_2e3ea425af36ccd33242e6e24d6" FOREIGN KEY ("art_work_id") REFERENCES "work_art_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_entity" ADD CONSTRAINT "FK_1c17587472177bbbfb547d2d70b" FOREIGN KEY ("buyer_id") REFERENCES "collector_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "collector_entity" ADD CONSTRAINT "FK_ed99e234a0551847b5ae7b3e642" FOREIGN KEY ("user_id") REFERENCES "users_entity"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens_entity" ADD CONSTRAINT "FK_344366a9a81ca033eaaf2956333" FOREIGN KEY ("user_id") REFERENCES "users_entity"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "art_work_transfer_history_entity" ADD CONSTRAINT "FK_c6d3184c9eb75ab29ba6db24419" FOREIGN KEY ("art_work_id") REFERENCES "work_art_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "art_work_transfer_history_entity" ADD CONSTRAINT "FK_75705a49c7abac43ff1f8b42e03" FOREIGN KEY ("from_gallery_id") REFERENCES "gallery_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "art_work_transfer_history_entity" ADD CONSTRAINT "FK_cc6f4be6c1bdbd1551d03a95aec" FOREIGN KEY ("to_gallery_id") REFERENCES "gallery_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "receipt_entity" ADD CONSTRAINT "FK_1a3b9986f34922216d838a5bb4f" FOREIGN KEY ("contract_id") REFERENCES "contract_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_entity" ADD CONSTRAINT "FK_1fbe0c0b21052285b13ea277bc0" FOREIGN KEY ("contract_id") REFERENCES "contract_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "art_work_exposition_entity" ADD CONSTRAINT "FK_40b69446506631ee0a770288a1f" FOREIGN KEY ("expositionEntityId") REFERENCES "exposition_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "art_work_exposition_entity" ADD CONSTRAINT "FK_a54a12f8d11cea15355389e7e86" FOREIGN KEY ("workArtEntityId") REFERENCES "work_art_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "art_work_exposition_entity" DROP CONSTRAINT "FK_a54a12f8d11cea15355389e7e86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "art_work_exposition_entity" DROP CONSTRAINT "FK_40b69446506631ee0a770288a1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_entity" DROP CONSTRAINT "FK_1fbe0c0b21052285b13ea277bc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "receipt_entity" DROP CONSTRAINT "FK_1a3b9986f34922216d838a5bb4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "art_work_transfer_history_entity" DROP CONSTRAINT "FK_cc6f4be6c1bdbd1551d03a95aec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "art_work_transfer_history_entity" DROP CONSTRAINT "FK_75705a49c7abac43ff1f8b42e03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "art_work_transfer_history_entity" DROP CONSTRAINT "FK_c6d3184c9eb75ab29ba6db24419"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens_entity" DROP CONSTRAINT "FK_344366a9a81ca033eaaf2956333"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collector_entity" DROP CONSTRAINT "FK_ed99e234a0551847b5ae7b3e642"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_entity" DROP CONSTRAINT "FK_1c17587472177bbbfb547d2d70b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_entity" DROP CONSTRAINT "FK_2e3ea425af36ccd33242e6e24d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gallery_entity" DROP CONSTRAINT "FK_aba161015514d2cd6aad3ad665f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gallery_entity" DROP CONSTRAINT "FK_b8c89bf9f8463c9cac1f5f569b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_entity" DROP CONSTRAINT "FK_83850227cd76dd87782845b2a01"`,
    );
    await queryRunner.query(
      `ALTER TABLE "artist_entity" DROP CONSTRAINT "FK_bb375ccf10e0fd167218e0191c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "artist_entity" DROP CONSTRAINT "FK_09243afc810634d49763066fb27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_art_entity" DROP CONSTRAINT "FK_6ece816401b84636a9eef883b85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_art_entity" DROP CONSTRAINT "FK_d0e102c3d5c15b8df2b823b21e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exposition_entity" DROP CONSTRAINT "FK_ec311ee7851718e45ef1993d9a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_request_entity" DROP CONSTRAINT "FK_39b222a1a69d99cf602b84b5d11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_request_entity" DROP CONSTRAINT "FK_426efdb09f293076033ff1df0e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_request_entity" DROP CONSTRAINT "FK_133522bdc70918b6bb1de8c75e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfer_request_entity" DROP CONSTRAINT "FK_2f2565375e8f5ef6b10b818e202"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_a54a12f8d11cea15355389e7e8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_40b69446506631ee0a770288a1"`);
    await queryRunner.query(`DROP TABLE "art_work_exposition_entity"`);
    await queryRunner.query(`DROP TABLE "invoice_entity"`);
    await queryRunner.query(`DROP TABLE "receipt_entity"`);
    await queryRunner.query(`DROP TABLE "art_work_transfer_history_entity"`);
    await queryRunner.query(
      `DROP TYPE "public"."art_work_transfer_history_entity_new_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."art_work_transfer_history_entity_current_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens_entity"`);
    await queryRunner.query(`DROP TABLE "users_entity"`);
    await queryRunner.query(`DROP TYPE "public"."users_entity_userrole_enum"`);
    await queryRunner.query(`DROP TABLE "collector_entity"`);
    await queryRunner.query(`DROP TABLE "contract_entity"`);
    await queryRunner.query(`DROP TABLE "gallery_entity"`);
    await queryRunner.query(`DROP TABLE "admin_entity"`);
    await queryRunner.query(`DROP TABLE "artist_entity"`);
    await queryRunner.query(`DROP TYPE "public"."artist_entity_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d52275042733d239732229cd69"`);
    await queryRunner.query(`DROP TABLE "work_art_entity"`);
    await queryRunner.query(`DROP TYPE "public"."work_art_entity_status_enum"`);
    await queryRunner.query(`DROP TABLE "exposition_entity"`);
    await queryRunner.query(`DROP TYPE "public"."exposition_entity_type_enum"`);
    await queryRunner.query(`DROP TABLE "transfer_request_entity"`);
    await queryRunner.query(`DROP TYPE "public"."transfer_request_entity_request_status_enum"`);
  }
}
