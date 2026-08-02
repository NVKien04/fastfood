import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddComboTables1785163173069 implements MigrationInterface {
  name = 'AddComboTables1785163173069';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "combo_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comboId" uuid NOT NULL, "groupName" character varying NOT NULL, "quantityAllowed" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f633e0564e3422d489c5cebe2e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "combos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "price" integer NOT NULL, "img" character varying NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', "isActive" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_5b4bab633aee439e2bade42cc3c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "order-items" ADD "comboId" uuid`);
    await queryRunner.query(`ALTER TABLE "order-items" ADD "price" integer`);
    await queryRunner.query(`ALTER TABLE "order-items" ADD "options" json`);
    await queryRunner.query(`ALTER TABLE "cart_items" ADD "comboId" uuid`);
    await queryRunner.query(`ALTER TABLE "cart_items" ADD "price" integer`);
    await queryRunner.query(`ALTER TABLE "cart_items" ADD "options" json`);
    await queryRunner.query(`ALTER TABLE "order-items" DROP CONSTRAINT "FK_4640b5bdb54311d9d1a4db9c0aa"`);
    await queryRunner.query(`ALTER TABLE "order-items" DROP CONSTRAINT "FK_74338f89c1143daa9cd01c32950"`);
    await queryRunner.query(`ALTER TABLE "order-items" ALTER COLUMN "productId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "order-items" ALTER COLUMN "productVariantId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_72679d98b31c737937b8932ebe6"`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_98ba4bbf6e3611d2062b898f5c1"`);
    await queryRunner.query(`ALTER TABLE "cart_items" ALTER COLUMN "productId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "cart_items" ALTER COLUMN "productVariantId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "combo_items" ADD CONSTRAINT "FK_3b4ce71c9b99bd8b26ce0618408" FOREIGN KEY ("comboId") REFERENCES "combos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-items" ADD CONSTRAINT "FK_4640b5bdb54311d9d1a4db9c0aa" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-items" ADD CONSTRAINT "FK_74338f89c1143daa9cd01c32950" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-items" ADD CONSTRAINT "FK_5515619939efb4df8d893693e94" FOREIGN KEY ("comboId") REFERENCES "combos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_98ba4bbf6e3611d2062b898f5c1" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_cae9ea0b56adddcafc6561f3db4" FOREIGN KEY ("comboId") REFERENCES "combos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_cae9ea0b56adddcafc6561f3db4"`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_98ba4bbf6e3611d2062b898f5c1"`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_72679d98b31c737937b8932ebe6"`);
    await queryRunner.query(`ALTER TABLE "order-items" DROP CONSTRAINT "FK_5515619939efb4df8d893693e94"`);
    await queryRunner.query(`ALTER TABLE "order-items" DROP CONSTRAINT "FK_74338f89c1143daa9cd01c32950"`);
    await queryRunner.query(`ALTER TABLE "order-items" DROP CONSTRAINT "FK_4640b5bdb54311d9d1a4db9c0aa"`);
    await queryRunner.query(`ALTER TABLE "combo_items" DROP CONSTRAINT "FK_3b4ce71c9b99bd8b26ce0618408"`);
    await queryRunner.query(`ALTER TABLE "cart_items" ALTER COLUMN "productVariantId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "cart_items" ALTER COLUMN "productId" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_98ba4bbf6e3611d2062b898f5c1" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "order-items" ALTER COLUMN "productVariantId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "order-items" ALTER COLUMN "productId" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "order-items" ADD CONSTRAINT "FK_74338f89c1143daa9cd01c32950" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-items" ADD CONSTRAINT "FK_4640b5bdb54311d9d1a4db9c0aa" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "options"`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "comboId"`);
    await queryRunner.query(`ALTER TABLE "order-items" DROP COLUMN "options"`);
    await queryRunner.query(`ALTER TABLE "order-items" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "order-items" DROP COLUMN "comboId"`);
    await queryRunner.query(`DROP TABLE "combos"`);
    await queryRunner.query(`DROP TABLE "combo_items"`);
  }
}
