import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RefreshTokenResponseDto {
  @Expose()
  id!: string;

  @Expose()
  token!: string;

  @Expose()
  userId!: string;

  @Expose()
  expiresAt!: Date;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
