import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1787223813752 implements MigrationInterface {
    name = 'UpdateSchema1787223813752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."orders_paymentstatus_enum" RENAME TO "orders_paymentstatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('đang chờ', 'đã thanh toán', 'thanh toán thất bại', 'đã hoàn trả', 'đã hủy')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "paymentStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "paymentStatus" TYPE "public"."orders_paymentstatus_enum" USING "paymentStatus"::"text"::"public"."orders_paymentstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "paymentStatus" SET DEFAULT 'đang chờ'`);
        await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."product_variants_size_enum" RENAME TO "product_variants_size_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."product_variants_size_enum" AS ENUM('20cm', '25cm', '30cm', '35cm')`);
        await queryRunner.query(`ALTER TABLE "product_variants" ALTER COLUMN "size" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product_variants" ALTER COLUMN "size" TYPE "public"."product_variants_size_enum" USING "size"::"text"::"public"."product_variants_size_enum"`);
        await queryRunner.query(`ALTER TABLE "product_variants" ALTER COLUMN "size" SET DEFAULT '20cm'`);
        await queryRunner.query(`DROP TYPE "public"."product_variants_size_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_variants_size_enum_old" AS ENUM('12cm', '15cm', '17cm', '13cm', '20cm', '23cm', '25cm', '30cm', '33cm', '35cm', '1 Miếng', '2 Miếng')`);
        await queryRunner.query(`ALTER TABLE "product_variants" ALTER COLUMN "size" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product_variants" ALTER COLUMN "size" TYPE "public"."product_variants_size_enum_old" USING "size"::"text"::"public"."product_variants_size_enum_old"`);
        await queryRunner.query(`ALTER TABLE "product_variants" ALTER COLUMN "size" SET DEFAULT '12cm'`);
        await queryRunner.query(`DROP TYPE "public"."product_variants_size_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."product_variants_size_enum_old" RENAME TO "product_variants_size_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentstatus_enum_old" AS ENUM('đang chờ', 'đã thanh toán', 'thanh toán thất bại', 'đã hoàn trả')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "paymentStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "paymentStatus" TYPE "public"."orders_paymentstatus_enum_old" USING "paymentStatus"::"text"::"public"."orders_paymentstatus_enum_old"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "paymentStatus" SET DEFAULT 'đang chờ'`);
        await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_paymentstatus_enum_old" RENAME TO "orders_paymentstatus_enum"`);
    }

}
