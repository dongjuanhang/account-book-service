import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOneOrFail({username});
  }

  async createOne(username: string, password: string, salt: string) {
    const user = new User();
    user.username = username;
    user.password = password;
    user.salt = salt;
    await this.userRepository.save(user);
    return this.userRepository.findOne({username});
  }
}
