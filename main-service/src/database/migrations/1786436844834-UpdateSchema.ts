import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchema1786436844834 implements MigrationInterface {
  name = 'UpdateSchema1786436844834';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Bỏ FK constraint của ingredientId (nếu còn tồn tại)
    await queryRunner.query(
      `ALTER TABLE "product_ingredients" DROP CONSTRAINT IF EXISTS "FK_b40728e717eb031baa2e85371ea"`,
    );
    // Bỏ FK constraint của productId (nếu còn tồn tại)
    await queryRunner.query(
      `ALTER TABLE "product_ingredients" DROP CONSTRAINT IF EXISTS "FK_0c47e7d54540edb8171ebe4e775"`,
    );

    // Thêm UNIQUE constraint cho slug của product
    await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224" UNIQUE ("slug")`);

    // Đổi kiểu productId từ uuid → varchar (không có FK)
    await queryRunner.query(`ALTER TABLE "product_ingredients" DROP COLUMN "productId"`);
    await queryRunner.query(`ALTER TABLE "product_ingredients" ADD "productId" character varying NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "product_ingredients" ALTER COLUMN "productId" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product_ingredients" DROP COLUMN "productId"`);
    await queryRunner.query(
      `ALTER TABLE "product_ingredients" ADD "productId" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(`ALTER TABLE "product_ingredients" ALTER COLUMN "productId" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224"`);
    await queryRunner.query(
      `ALTER TABLE "product_ingredients" ADD CONSTRAINT "FK_0c47e7d54540edb8171ebe4e775" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ingredients" ADD CONSTRAINT "FK_b40728e717eb031baa2e85371ea" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
