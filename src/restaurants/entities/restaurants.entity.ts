import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

//DTO는 데이터 엔티티는 구성
//클래스 하나로 graphql 스키마와 db에 저장되는 실제 데이터의 형식을 데코레이터를 이용해 만들 수 있다.
//GraphQL을 위한 ObjectType과 TypeOrm을 위한 Entity를 한 번 쓸 수 있다.
@ObjectType() //objectType은 자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator이다.
@Entity() //Entity는 TypeORM이 DB에 내용들을 저장 할 수 있게 해준다.
export class Restaurant {
  @PrimaryGeneratedColumn() //primary컬럼 만들어주기
  @Field((type) => Number)
  id: number;

  @Field((type) => String) //graphql
  @Column() //typeorm
  name: string;

  @Field((type) => Boolean)
  @Column()
  isVegan: boolean;

  @Field((type) => String)
  @Column()
  address: string;

  @Field((type) => String)
  @Column()
  ownersName: string;
}
//3.0
//typeorm이 DB에 entity를 넣게 하려면 entity의 위치를 알려주어야 한다.
//1. typeormmodule에 entities : [Restaurant] 처럼 넣기
// synchronize가 true라  TypeORM이 Entity를 찾고 알아서 migration해준다.
//2. 수동적으로 하고 싶으면 Node_ENV가 prod가 아닐때만 싱크로나이즈가 true가 되게 한다.
//production에는 실제 데이터가 있기 때문에 DB를 따로 migrate하고 싶을 수 있으므로

//Entity는 데이터베이스에저장되는 데이터의 형태를 보여주는 모델
//graphQl에서 사용하는 스키마를 자동으로 생성해주고 DB에도 자동으로 즉시 반영해주는 것

//3.1
//TS를 이용해 DB에있는 Restaurant에 접근하는 방법
//TypeOrmModeule 에서 Repository사용
//Active Record vs Data Mapper => DB랑 상호작용할 때 사용하는 패턴
//Active Record를 사용하려면 Entity를 BaseEntity로 extends 해줘야 한다.
/*@Entity()
  export class User extends BaseEntity
*/
//여기서는 extends를 해주지 않았는 DataMapper 패턴을 사용할 것이기 때문이다.
//DataMapper은 repository(Entity와 상호 작용하는 것을 담당)를 이용
/*
USer Entity에 접근하기 위해 getRepository(User)를 사용 하면된다.
const userRepository = connectio.getRepository(User);

const user = new User();
user.firstName = "Timber"
...
await userRepository.save(user);
User 대신 user,repository를 쓰는 것을 빼곤 거의 다를게 없다(Active와)
Data Mapper는 유지 관리를 도와주고 대규모 앱에서 유용
Active Record는 소규모 앱에서 단순하게 사용할 수 있도록 도와준다.

NsetJS 애플리케이션에서 Data Mapper를 사용하려는 이유는 
NestJS + TypeORM 개발 환경에서 Repository를 사용하는 모듈을 쓸 수 있기 때문이다. 
또한 Repository를 사용하면 어디서든지 접근 가능
실제 구현 서비스나 테스팅에서 가능

3.2

*/
