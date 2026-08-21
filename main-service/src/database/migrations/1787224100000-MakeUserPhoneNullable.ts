import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '../../entities';

export class MakeUserPhoneNullable1787224100000 implements MigrationInterface {
  name = 'MakeUserPhoneNullable1787224100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "so_dien_thoai" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "so_dien_thoai" SET NOT NULL`);
  }
}
