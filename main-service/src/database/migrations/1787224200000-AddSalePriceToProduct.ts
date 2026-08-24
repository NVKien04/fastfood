import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSalePriceToProduct1787224200000 implements MigrationInterface {
  name = 'AddSalePriceToProduct1787224200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ADD "salePrice" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "salePrice"`);
  }
}
