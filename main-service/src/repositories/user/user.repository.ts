import { UserEntity } from 'src/entities/user.entity';
import { IUserRepository } from './user.repository.interface';
import { BaseRepository } from '../base/base.repository';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserEntity) repo: Repository<UserEntity>,
    private DataSource: DataSource,
  ) {
    super(repo);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.repo.findOne({ where: { id } });
  }

  createUserDemo(userDto: CreateUserDto): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
}
