import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
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
  @IsString()
  ownersName: string;
}
//validationpipe로 유효성 검사
//Main.ts app에서 pipe를 만들어줘야 한다.

// InputType은 그저 하나의 객체
// ArgsType은 각각 arg

//class와 수 많은 decorators의 조합으로 인해 얻을 수 있는 이점
//decorator를 쌓아서 쓰기만 하면 됨
