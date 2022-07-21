//service는 repository를 필요로 한다.

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
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
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    //오브젝트로도 가능
    //조금 더 깔끔한 코드
    try {
      const exists = await this.users.findOne({ where: { email } }); //버전이 올라가면서 where를 명시적으로 써주게 바꼈습니다
      if (exists) {
        //make error
        return { ok: false, error: 'There is a user with that email already' };
      }
      await this.users.save(this.users.create({ email, password, role })); //create은 생성만 DB에 저장은 안함
      return { ok: true };
    } catch (e) {
      //make error
      return { ok: false, error: "Couldn't create account" }; //여기서 그냥 에러를 리턴
    }
    // check new user
    // create user & hash the password
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // make a JWT and give it to the user
    try {
      const user = await this.users.findOne({ where: { email } });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      return {
        ok: true,
        token: 'lalalalaalala',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
/*
데이터베이스에 비밀번호를 바로 입력하는 것은, 정말 나쁜 보안 방법이다.
그래서 password를 hash 할 것
- password를 hash 할 때, 데이터베이스에 password를 있는 그대로 저장하지 않는다.
- hash를 저장한다, hashsms function이다. 단방향 함수(one-way function)
- 문자를 받아서 hash에 통과 시키면 hash 함수가 암호화된 비밀번호를 준다.

이것들을 알려면 먼저 listener를 공부해야 한다.
-listener는 기본적으로 entity에 무슨 일이 생길 때 실행된다.
-특정 entity event를 listen하는 사용자 로직이 있는 method를 가질 수 있다.

정리
비밀번호 털렸다고? 암호화. 해시함수. 5분 설명
https://www.youtube.com/watch?v=67UwxR3ts2E

Entity Listeners and Subscribers
모든 엔터티에는 특정 엔터티 이벤트를 listen하는 커스텀 로직 메서드를 가질 수 있습니다.
그래서 listen하려는 이벤트를 메서드에 특별한 데코레이터로 마크해줍니다.
주의! listener 내에서 데이터베이스 호출을 수행하지 말고, 대신 subscribers를 선택하십시오.
https://typeorm.io/#/listeners-and-subscribers

@BeforeInsert
이 엔터티 삽입 전에 이 데코레이터가 적용되는 메서드를 호출합니다.
엔티티에 메소드를 정의하고 @BeforeInsert 데코레이터로 표시하면 TypeORM은 엔티티가 repository/manager save를 사용하여 insert되기 전에 이 메서드를 호출합니다.
ex) mongoose에서 pre save처럼 DB에 저장되기 전에 실행되는 함수
```
@BeforeInsert()
updateDates() {
this.createdDate = new Date();
}
```
https://typeorm.io/#/listeners-and-subscribers/beforeinsert

bcrypt
npm i bcrypt
npm i @types/bcrypt -D
https://www.npmjs.com/package/bcrypt

주의! import * as bcrypt from 'bcrypt';가 아닌
import bcrypt from 'bcrypt';로 import하게 되면 bcrypt에 함수가 아닌 undefined가 담겨 hash함수가 제대로 동작하지 않는 문제가 있음
*/
