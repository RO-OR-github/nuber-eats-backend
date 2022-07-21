import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  @Field((type) => String, { nullable: true })
  error?: string;
  // One is for TS, the other one is for the Database column :)

  @Field((type) => Boolean)
  ok: boolean;
}
