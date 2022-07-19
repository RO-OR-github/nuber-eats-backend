//service는 repository를 필요로 한다.

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {} //type이 Repository이고 Repository type은 user entity가 된다. => 이것들이 Constructor

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<string | undefined> {
    try {
      const exists = await this.users.findOne({ where: { email } }); //버전이 올라가면서 where를 명시적으로 써주게 바꼈습니다
      if (exists) {
        //make error
        return 'There is a user with that email already';
      }
      await this.users.save(this.users.create({ email, password, role }));
    } catch (e) {
      //make error
      return "Couldn't create account"; //여기서 그냥 에러를 리턴
    }
    // check new user
    // create user & hash the password
  }
}
