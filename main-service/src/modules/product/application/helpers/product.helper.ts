import { Product } from '@/modules/product/domain/entities/product.domain';
import { ProductVariant } from '@/modules/product-variant/domain/entities/product-variant.domain';
import { Ingredient } from '@/modules/ingredient/domain/entities/ingredient.domain';
import { ProductVariantService } from '@/modules/product-variant/application/services/product-variant.service';
import { IngredientService } from '@/modules/ingredient/application/services/ingredient.service';
import {
  ProductDetailResponseDto,
  ProductVariantResponseDto,
  ProductIngredientResponseDto,
} from '@/modules/product/presentation/dto';

export class ProductHelper {
  /**
   * Lấy variants và ingredients (dựa theo categoryId của sản phẩm) song song.
   */
  static async buildDetail(
    product: Product,
    productVariantService: ProductVariantService,
    ingredientService: IngredientService,
  ): Promise<ProductDetailResponseDto> {
    const [variants, categoryIngredients] = await Promise.all([
      productVariantService.findByProductId(product.id),
      ingredientService.findByCategoryId(product.categoryId),
    ]);

    return this.toDetailDto(product, variants, categoryIngredients);
  }

  /**
   * Chuyển đổi Product, ProductVariants và Ingredients thành ProductDetailResponseDto.
   */
  static toDetailDto(
    product: Product,
    rawVariants: ProductVariant[],
    categoryIngredients: Ingredient[],
  ): ProductDetailResponseDto {
    const variants: ProductVariantResponseDto[] = rawVariants.map((v) => ({
      id: v.id,
      name: v.name,
      size: v.size,
      type: v.type,
      modifiedPrice: v.modifiedPrice,
      sortOrder: v.sortOrder,
      isActive: v.isActive,
    }));

    const ingredients: ProductIngredientResponseDto[] = categoryIngredients.map((ing) => ({
      id: ing.id,
      name: ing.name,
      imageUrl: ing.imageUrl,
      description: ing.description,
      price: ing.price,
      isRequired: Number(ing.isRequired ?? 1),
      isActive: Number(ing.isActive ?? 1),
      categoryId: ing.categoryId,
    }));

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice,
      sortOrder: product.sortOrder,
      img: product.img,
      isFeatured: product.isFeatured,
      categoryId: product.categoryId,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      variants,
      ingredients,
    };
  }
}
