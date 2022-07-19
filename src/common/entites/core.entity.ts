import { Field } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CoreEntity {
  //엔티티를 만들고 graphQL type들도 넣어줌
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field((type) => Date)
  updatedAt: Date;
}
/*
4.1
TypeOrm 공식 문서에 보면 나와있지만
여기서 사용할 CreateDateColumn 은 entity를 만들었을 때 자동으로
설정해 주는 special column이다.

TypeORM special columns

추가 기능을 사용할 수 있는 몇 가지 Special columns들이 있습니다.

@CreateDateColumn은 엔터티의 삽입 날짜로 자동 설정되는 특수 열입니다. 이 열은 설정할 필요가 없습니다. 자동으로 설정됩니다.

@UpdateDateColumn은 entity manager 또는 repository의 저장을 호출할 때마다 엔티티의 업데이트 시간으로 자동 설정되는 특수 컬럼입니다. 이 열은 설정할 필요가 없습니다. 자동으로 설정됩니다.

@DeleteDateColumn은 entity manager 또는 repository의 일시 삭제를 호출할 때마다 엔터티의 삭제 시간으로 자동 설정되는 특수 열입니다. 이 열은 설정할 필요가 없습니다. 자동으로 설정됩니다. @DeleteDateColumn이 설정되면 기본 범위는 "삭제되지 않음"이 됩니다.

https://typeorm.io/#/entities/special-columns

GraphQLError [Object]: Query root type must be provided
터미널에 위와 같은 오류 뜨시는 분들은 지금 아직 Query를 하나도 만들지 않아도 뜨는 오류이기 때문에 그냥 다음 강의로 넘어가셔도 됩니다.
*/
