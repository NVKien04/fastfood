export class CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: number;
  createdAt: Date;
  updatedAt: Date;
}
