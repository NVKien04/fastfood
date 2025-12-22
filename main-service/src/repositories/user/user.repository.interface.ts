import { UserEntity } from 'src/entities/user.entity';
import { IBaseRepository } from '../base/base.interface';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';

export interface IUserRepository extends IBaseRepository<UserEntity> {
  createUserDemo(userDto: CreateUserDto): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
}
