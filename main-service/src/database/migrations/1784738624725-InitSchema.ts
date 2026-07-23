import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1784738624725 implements MigrationInterface {
  name = 'InitSchema1784738624725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order-items-ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ingredientId" integer NOT NULL, "orderItemId" uuid NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a590b628e91dca08528ac11b936" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order-items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "orderId" uuid NOT NULL, "productVariantId" integer NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_605fbaee38242facaa1a34b67ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."product_variants_size_enum" AS ENUM('12cm', '15cm', '17cm')`);
    await queryRunner.query(`CREATE TYPE "public"."product_variants_type_enum" AS ENUM('nhỏ', 'vừa', 'lớn')`);
    await queryRunner.query(
      `CREATE TABLE "product_variants" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "size" "public"."product_variants_size_enum" NOT NULL DEFAULT '12cm', "type" "public"."product_variants_type_enum" NOT NULL DEFAULT 'vừa', "modifiedPrice" integer NOT NULL DEFAULT '0', "isActive" integer NOT NULL DEFAULT '1', "sortOrder" integer NOT NULL DEFAULT '0', "productId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "totalCartPrice" integer NOT NULL, "totalItemDiff" integer NOT NULL, "totalItems" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "productVariantId" integer NOT NULL, "cartId" uuid NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_item_ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cartItemId" uuid NOT NULL, "ingredientId" integer NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_dbaf69275440372543040698cdd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "ingredientId" integer NOT NULL, "isDefault" integer NOT NULL, "quantity" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_82b8cf241e3716a8d4682e79190" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ingredients" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "imageUrl" character varying NOT NULL, "description" text NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', "price" integer NOT NULL, "isRequired" integer NOT NULL DEFAULT '1', "isActive" integer NOT NULL DEFAULT '1', "categoryId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "sortOrder" integer NOT NULL DEFAULT '0', "isActive" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "basePrice" integer NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', "img" character varying NOT NULL, "isFeatured" integer NOT NULL DEFAULT '0', "categoryId" integer NOT NULL, "isActive" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "comment" text NOT NULL, "userId" uuid NOT NULL, "productId" uuid NOT NULL, "order_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_e4b0ed40bdd0f318108612c2851" UNIQUE ("order_id"), CONSTRAINT "REL_e4b0ed40bdd0f318108612c285" UNIQUE ("order_id"), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('đang chờ', 'đã xác nhận', 'đang chuẩn bị', 'sẵn sàng', 'đã giao hàng', 'đã hủy')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('đang chờ', 'đã thanh toán', 'thanh toán thất bại', 'đã hoàn trả')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_paymentmethod_enum" AS ENUM('thanh toán khi giao hàng', 'thanh toán online')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderNumber" character varying NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'đang chờ', "paymentStatus" "public"."orders_paymentstatus_enum" NOT NULL DEFAULT 'đang chờ', "paymentMethod" "public"."orders_paymentmethod_enum", "subTotal" integer NOT NULL, "deliveryFee" integer NOT NULL, "discount" integer NOT NULL, "total" integer NOT NULL, "notes" text, "userId" uuid NOT NULL, "addressId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_59b0c3b34ea0fa5562342f24143" UNIQUE ("orderNumber"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying NOT NULL, "city" character varying NOT NULL, "district" character varying NOT NULL, "ward" character varying NOT NULL, "longitude" numeric(10,7) NOT NULL, "latitude" numeric(10,7) NOT NULL, "isDefault" integer NOT NULL DEFAULT '1', "userId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "coupons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "value" integer NOT NULL, "minOrderAmount" integer NOT NULL DEFAULT '0', "maxUser" integer NOT NULL DEFAULT '1', "currentUses" integer NOT NULL DEFAULT '0', "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "isActive" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_d7ea8864a0150183770f3e9a8cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_coupons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isUsed" integer NOT NULL DEFAULT '0', "user_at" TIMESTAMP, "userId" uuid NOT NULL, "couponsId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_b9e7272f1f73463f57827b601ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b9b302800d93238f5ce8a99980" ON "user_coupons" ("userId", "couponsId") `,
    );
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'customer')`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "so_dien_thoai" character varying NOT NULL, "avatar" character varying, "role" "public"."users_role_enum", "provider" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-items-ingredients" ADD CONSTRAINT "FK_d445922a60c78968e836e970f7f" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-items-ingredients" ADD CONSTRAINT "FK_6f43bee1032de6d7e01151086a2" FOREIGN KEY ("orderItemId") REFERENCES "order-items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-items" ADD CONSTRAINT "FK_4640b5bdb54311d9d1a4db9c0aa" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-items" ADD CONSTRAINT "FK_d42918a88740ece11347e20918f" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-items" ADD CONSTRAINT "FK_74338f89c1143daa9cd01c32950" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_f515690c571a03400a9876600b5" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_98ba4bbf6e3611d2062b898f5c1" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_edd714311619a5ad09525045838" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item_ingredients" ADD CONSTRAINT "FK_c5418865ac33cd11b0f07458879" FOREIGN KEY ("cartItemId") REFERENCES "cart_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item_ingredients" ADD CONSTRAINT "FK_98d27f9f0623d6ae7ab6a1878d3" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ingredients" ADD CONSTRAINT "FK_0c47e7d54540edb8171ebe4e775" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ingredients" ADD CONSTRAINT "FK_b40728e717eb031baa2e85371ea" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ingredients" ADD CONSTRAINT "FK_8f7060de1f9dc5d70ed029a1747" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_a6b3c434392f5d10ec171043666" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_e4b0ed40bdd0f318108612c2851" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_37636d260931dcf46d11892f614" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_coupons" ADD CONSTRAINT "FK_8c358ab3b82c503b6c1c30350bf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_coupons" ADD CONSTRAINT "FK_48aead0c2962dd235a247cfdead" FOREIGN KEY ("couponsId") REFERENCES "coupons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_coupons" DROP CONSTRAINT "FK_48aead0c2962dd235a247cfdead"`);
    await queryRunner.query(`ALTER TABLE "user_coupons" DROP CONSTRAINT "FK_8c358ab3b82c503b6c1c30350bf"`);
    await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_95c93a584de49f0b0e13f753630"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_37636d260931dcf46d11892f614"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
    await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_e4b0ed40bdd0f318108612c2851"`);
    await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_a6b3c434392f5d10ec171043666"`);
    await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
    await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
    await queryRunner.query(`ALTER TABLE "ingredients" DROP CONSTRAINT "FK_8f7060de1f9dc5d70ed029a1747"`);
    await queryRunner.query(`ALTER TABLE "product_ingredients" DROP CONSTRAINT "FK_b40728e717eb031baa2e85371ea"`);
    await queryRunner.query(`ALTER TABLE "product_ingredients" DROP CONSTRAINT "FK_0c47e7d54540edb8171ebe4e775"`);
    await queryRunner.query(`ALTER TABLE "cart_item_ingredients" DROP CONSTRAINT "FK_98d27f9f0623d6ae7ab6a1878d3"`);
    await queryRunner.query(`ALTER TABLE "cart_item_ingredients" DROP CONSTRAINT "FK_c5418865ac33cd11b0f07458879"`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_edd714311619a5ad09525045838"`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_98ba4bbf6e3611d2062b898f5c1"`);
    await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_72679d98b31c737937b8932ebe6"`);
    await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
    await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_f515690c571a03400a9876600b5"`);
    await queryRunner.query(`ALTER TABLE "order-items" DROP CONSTRAINT "FK_74338f89c1143daa9cd01c32950"`);
    await queryRunner.query(`ALTER TABLE "order-items" DROP CONSTRAINT "FK_d42918a88740ece11347e20918f"`);
    await queryRunner.query(`ALTER TABLE "order-items" DROP CONSTRAINT "FK_4640b5bdb54311d9d1a4db9c0aa"`);
    await queryRunner.query(`ALTER TABLE "order-items-ingredients" DROP CONSTRAINT "FK_6f43bee1032de6d7e01151086a2"`);
    await queryRunner.query(`ALTER TABLE "order-items-ingredients" DROP CONSTRAINT "FK_d445922a60c78968e836e970f7f"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b9b302800d93238f5ce8a99980"`);
    await queryRunner.query(`DROP TABLE "user_coupons"`);
    await queryRunner.query(`DROP TABLE "coupons"`);
    await queryRunner.query(`DROP TABLE "addresses"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_paymentmethod_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "ingredients"`);
    await queryRunner.query(`DROP TABLE "product_ingredients"`);
    await queryRunner.query(`DROP TABLE "cart_item_ingredients"`);
    await queryRunner.query(`DROP TABLE "cart_items"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "product_variants"`);
    await queryRunner.query(`DROP TYPE "public"."product_variants_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."product_variants_size_enum"`);
    await queryRunner.query(`DROP TABLE "order-items"`);
    await queryRunner.query(`DROP TABLE "order-items-ingredients"`);
  }
}
