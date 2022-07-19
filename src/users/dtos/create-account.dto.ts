import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}
//create Account DTO

@ObjectType()
export class CreateAccountOutput {
  @Field((type) => String, { nullable: true })
  error?: string;
  // One is for TS, the other one is for the Database column :)

  @Field((type) => Boolean)
  ok: boolean;
}
