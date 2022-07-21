import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurants.entity';

@InputType('CategoryInputType', { isAbstract: true }) //이름만들어주기(다른 것임을 알려주기 위해)
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string; //null 값 오류 이유 => 데이터베이스 이전 데이터로 인해 삭제후 재실행

  @Field((type) => [Restaurant], { nullable: true }) //식당이 없을 수 도 있기 때문에(카테고리)
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];
}

/*
10.1
Many-to-one / one-to-many relations

다대일/일대다 관계는 A가 B의 여러 인스턴스를 포함하지만 B는 A의 인스턴스를 하나만 포함하는 관계입니다. User 및 Photo 엔터티를 예로 들어 보겠습니다. 사용자는 여러 장의 사진을 가질 수 있지만 각 사진은 한 명의 사용자만 소유합니다.

@OneToMany(): 일대다 관계에서 '다'에 속할 때 사용
(DB에 해당 컬럼은 저장되지 않음)
@ManyToOne(): 일대다 관계에서 '일'에 속할 때 사용
(DB에 user면 userId로 id값만 저장됨)
```
@Entity()
export class Photo {
@ManyToOne(() => User, user => user.photos)
user: User;
}

@Entity()
export class User {
@OneToMany(() => Photo, photo => photo.user)
photos: Photo[];
}
```
https://typeorm.io/#/many-to-one-one-to-many-relations
*/
