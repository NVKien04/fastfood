import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1767863725619 implements MigrationInterface {
    name = 'Migrations1767863725619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_95c93a584de49f0b0e13f753630"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "userId" character varying NOT NULL`);
    }

}
