import { UserEntity } from '#src/entities/user.entity';
import { IBaseRepository } from '#src/shared/base/base.interface';
import { CreateUserDto } from '#src/modules/user/dto/create-user.dto';
import { PaginationResponse } from '#src/common/core/paganation';
import { filterObj } from '#src/common/core/filterObj';

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  GetPage(filterObj: filterObj, userScope?: any): Promise<PaginationResponse<any>>;
}
