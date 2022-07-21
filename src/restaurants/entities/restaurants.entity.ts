import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { isAbstractType } from 'graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

//DTO는 데이터 엔티티는 구성
//클래스 하나로 graphql 스키마와 db에 저장되는 실제 데이터의 형식을 데코레이터를 이용해 만들 수 있다.
//GraphQL을 위한 ObjectType과 TypeOrm을 위한 Entity를 한 번 쓸 수 있다.

@InputType('RestaurantInputType', { isAbstract: true }) //인풋타입이 스키마에 포함되지 않길 원한다, 이걸 어디선가 복사해서 쓴다.
@ObjectType() //objectType은 자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator이다.
@Entity() //Entity는 TypeORM이 DB에 내용들을 저장 할 수 있게 해준다.
export class Restaurant extends CoreEntity {
  @Field((type) => String) //graphql
  @Column() //typeorm
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;
  //graphql, database, validation을 위해 3번씩 테스트 해야한다.
  //default value와 nullable의 차이 : defaultvalue 값을 추가 해준다.
  @Field((type) => String, { defaultValue: '강남' })
  @Column()
  @IsString()
  address: string;

  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL', //ondelete 함수
  })
  category: Category;

  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: 'CASCADE', //user가 지워지면 restaurant도 지운다.
  })
  owner: User;
  // @Field((type) => String)
  // @Column()
  // @IsString()
  // ownersName: string;

  // @Field((type) => String)
  // @Column() //null오류로 인해 default 값 x //수정 dist폴더 삭제후 실행 복원하니 수정 됨
  // @IsString()
  // categoryName: string;
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

3.5
entity 파일에서 
데코레이터를 이용해 grphql과 db를 모두 만들어주지만
dto와 entity가 통합되어 생성되지 않아 일일히 다 바꿔줘야하는 문제가 있다.
이걸 해결하기 위해 Mapped types를 사용

Mapped types
이 장은 code first 접근 방식에만 적용됩니다.
CRUD(Create/Read/Update/Delete)와 같은 기능을 구축할 때 기본 엔터티 유형에 대한 변형을 구성하는 것이 종종 유용합니다. Nest는 이 작업을 보다 편리하게 하기 위해 유형 변환을 수행하는 여러 유틸리티 함수를 제공합니다.

Mapped types들을 사용하기 위해서는 @InputType데코레이터로 선언되야 하고, 따로 지정하지 않으면 부모 클래스와 동일한 데코레이터를 사용한다.
부모 클래스와 자식 클래스가 다른 경우(예: 부모가 @ObjectType으로 선언된 경우) 두 번째 인수로 InputType을 전달해서 자식 클래스에게 @InputType데코레이터를 사용하도록 한다.
```
@InputType()
export class UpdateUserInput extends PartialType(User, InputType) {}
```
https://docs.nestjs.com/graphql/mapped-types

@InputType({ isAbstract: true })을 지정하게 되면 현재 클래스를 GraphQL스키마에 추가하지 않고, 어딘가에 복사해서 쓰는 용도로만 사용하도록 지정한다.

Mapped Types의 종류

PatianalType은 base type, base class를 가져다가 export하고 이 모든 field가
required가 아닌 class를 만들어준다.

PickType은 input type에서 몇 가지 property를 선택해 새로운 class를 만든다.

OmitType은 base class에서 class를 만드는데 몇몇 field를 제외하고 만든다.

IntersecionType은 두 input을 합쳐주는 역할이다.

nullable?: boolean;
relation column 값이 null을 허용할 수 있는지 여부를 나타냅니다.

Relation options
onDelete: "RESTRICT"|"CASCADE"|"SET NULL"
참조된 객체가 삭제될 때, 외래 키(foreign key)가 어떻게 작동해야 하는지 지정한다.
https://orkhan.gitbook.io/typeorm/docs/relations#relation-options

10.1
타입이 너무 많아 어느 타입인지 모르므로 이름을 다르게 만들어준다.
*/
