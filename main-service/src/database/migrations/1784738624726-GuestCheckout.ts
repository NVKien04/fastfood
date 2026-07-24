import { MigrationInterface, QueryRunner } from 'typeorm';

export class GuestCheckout1784738624726 implements MigrationInterface {
  name = 'GuestCheckout1784738624726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make userId and addressId nullable
    await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "userId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "addressId" DROP NOT NULL`);

    // Add guest checkout columns
    await queryRunner.query(`ALTER TABLE "orders" ADD "guestName" character varying`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "guestPhone" character varying`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "guestEmail" character varying`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "guestAddress" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove guest checkout columns
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "guestAddress"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "guestEmail"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "guestPhone"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "guestName"`);

    // Re-enforce NOT NULL constraints (Caution: this will fail if there are guest orders in the database)
    await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "addressId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "userId" SET NOT NULL`);
  }
}
