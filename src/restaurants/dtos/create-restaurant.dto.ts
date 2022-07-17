import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Restaurant } from '../entities/restaurants.entity';

@InputType()
export class CreateRestaurantDto extends OmitType(
  Restaurant,
  ['id'],
  InputType,
) {} //부모는 오브젝트타입, 자식은 인풋 타입일때 두번째 argument로 Inputtype을 전달

/*
  @Field((type) => String)
  @IsString()
  @Length(5, 10) //길이 조절
  name: string;

  @Field((type) => Boolean)
  @IsBoolean()
  isVegan: boolean;

  @Field((type) => String)
  @IsString()
  address: string;

  @Field((type) => String)
  ownersName: string;
 */
//validationpipe로 유효성 검사
//Main.ts app에서 pipe를 만들어줘야 한다.

// InputType은 그저 하나의 객체
// ArgsType은 각각 arg

//class와 수 많은 decorators의 조합으로 인해 얻을 수 있는 이점
//decorator를 쌓아서 쓰기만 하면 됨
