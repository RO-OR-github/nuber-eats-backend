import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity } from 'typeorm';

enum UserRole { //enum 타입 이름있는 숫자를 갖는 객체 정도
  Owner, //데이터 베이스에서 0
  Client, //1
  Delivery, //2
}
registerEnumType(UserRole, { name: 'UserRole' }); //graphql에 enum 추가
//type UserRole = 'client' | 'owner' | 'delivery'; //타입

@InputType({ isAbstract: true }) //인풋타입이 스키마에 포함되지 않길 원한다, 이걸 어디선가 복사해서 쓴다.
@ObjectType()
@Entity()
export class User extends CoreEntity {
  //기본적인 부분은 반복하기 싫으므로 확장을 하여 사용
  @Column()
  @Field((type) => String)
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole) //추가해줬기 때문에 가능
  role: UserRole; //client, owner, delivery중 하나
}
/*
4.1
모든entity들은 ID, createdAt, updateAt를 가진다.
common 모듈을 만들어 기본적으로 공유되는 모든 것을 적용한다.

4.2
Enums
enum은 특정 허용 값 집합으로 제한되는 특수한 종류의 스칼라입니다.
이 유형의 모든 인수가 허용되는 값 중 하나인지 확인
필드가 항상 유한한 값 집합 중 하나임을 유형 시스템을 통해 전달

code first 접근 방식을 사용할 때 TypeScript enum을 생성하여 GraphQL enum type을 정의합니다.
registerEnumType 함수를 사용하여 AllowedColor enum을 등록합니다.
```
export enum AllowedColor {
RED,
GREEN,
BLUE,
}
registerEnumType(AllowedColor, { name: 'AllowedColor' });
```
https://docs.nestjs.com/graphql/unions-and-enums#code-first-1
https://www.typescriptlang.org/ko/docs/handbook/enums.html
*/
