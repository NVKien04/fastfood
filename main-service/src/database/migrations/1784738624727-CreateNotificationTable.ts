import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationTable1784738624727 implements MigrationInterface {
  name = 'CreateNotificationTable1784738624727';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create notifications enum type
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('order_status', 'promotion', 'system')`,
    );

    // Create notifications table
    await queryRunner.query(
      `CREATE TABLE "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "content" text NOT NULL,
        "type" "public"."notifications_type_enum" NOT NULL DEFAULT 'system',
        "isRead" boolean NOT NULL DEFAULT false,
        "userId" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_notifications_id" PRIMARY KEY ("id")
      )`,
    );

    // Add foreign key constraint to users table
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key
    await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_userId"`);

    // Drop table
    await queryRunner.query(`DROP TABLE "notifications"`);

    // Drop enum type
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
  }
}
