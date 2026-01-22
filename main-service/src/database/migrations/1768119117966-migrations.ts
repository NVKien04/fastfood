import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1768119117966 implements MigrationInterface {
    name = 'Migrations1768119117966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order-items-ingredients" DROP CONSTRAINT "FK_10537a4cdf5ace1268150a72e48"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_084db07582010217b0be3d79eec"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_9dee0dca61908ab73ed165029cb"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_73e64b4a389ad062cf83d3b4a0f"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_53a68dc905777554b7f702791fa"`);
        await queryRunner.query(`ALTER TABLE "order-items-ingredients" RENAME COLUMN "orderItem" TO "orderItemId"`);
        await queryRunner.query(`ALTER TABLE "cart_items" RENAME COLUMN "cartsId" TO "cartId"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "orderId" TO "orderObjId"`);
        await queryRunner.query(`CREATE TABLE "cart_item_ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cartItemId" uuid NOT NULL, "ingredientId" uuid NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_dbaf69275440372543040698cdd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "cartItemId"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "ingredientId"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "longtitude"`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "UQ_756f53ab9466eb52a52619ee019" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "totalCartPrice" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "totalItemDiff" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "totalItems" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "longitude" numeric(10,7) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "orderObjId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "UQ_3507a0252d4b0814d45b1c96253" UNIQUE ("orderObjId")`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "addressId"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "addressId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "latitude" numeric(10,7) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b9b302800d93238f5ce8a99980" ON "user_coupons" ("userId", "couponsId") `);
        await queryRunner.query(`ALTER TABLE "order-items-ingredients" ADD CONSTRAINT "FK_6f43bee1032de6d7e01151086a2" FOREIGN KEY ("orderItemId") REFERENCES "order-items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_edd714311619a5ad09525045838" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item_ingredients" ADD CONSTRAINT "FK_c5418865ac33cd11b0f07458879" FOREIGN KEY ("cartItemId") REFERENCES "cart_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item_ingredients" ADD CONSTRAINT "FK_98d27f9f0623d6ae7ab6a1878d3" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_3507a0252d4b0814d45b1c96253" FOREIGN KEY ("orderObjId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_37636d260931dcf46d11892f614" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_37636d260931dcf46d11892f614"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_3507a0252d4b0814d45b1c96253"`);
        await queryRunner.query(`ALTER TABLE "cart_item_ingredients" DROP CONSTRAINT "FK_98d27f9f0623d6ae7ab6a1878d3"`);
        await queryRunner.query(`ALTER TABLE "cart_item_ingredients" DROP CONSTRAINT "FK_c5418865ac33cd11b0f07458879"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_edd714311619a5ad09525045838"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "order-items-ingredients" DROP CONSTRAINT "FK_6f43bee1032de6d7e01151086a2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9b302800d93238f5ce8a99980"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "latitude" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "addressId"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "addressId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "UQ_3507a0252d4b0814d45b1c96253"`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "orderObjId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "totalItems"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "totalItemDiff"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "totalCartPrice"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "UQ_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "longtitude" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "quantity" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "ingredientId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "cartItemId" uuid NOT NULL`);
        await queryRunner.query(`DROP TABLE "cart_item_ingredients"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "orderObjId" TO "orderId"`);
        await queryRunner.query(`ALTER TABLE "cart_items" RENAME COLUMN "cartId" TO "cartsId"`);
        await queryRunner.query(`ALTER TABLE "order-items-ingredients" RENAME COLUMN "orderItemId" TO "orderItem"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_53a68dc905777554b7f702791fa" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_73e64b4a389ad062cf83d3b4a0f" FOREIGN KEY ("cartsId") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_9dee0dca61908ab73ed165029cb" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_084db07582010217b0be3d79eec" FOREIGN KEY ("cartItemId") REFERENCES "cart_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order-items-ingredients" ADD CONSTRAINT "FK_10537a4cdf5ace1268150a72e48" FOREIGN KEY ("orderItem") REFERENCES "order-items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
