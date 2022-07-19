import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Boolean)
  hi() {
    return true;
  } //GraphQLError: Query root type must be provided.

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const [ok, error] = await this.usersService.createAccount(
        createAccountInput,
      );
      return {
        ok, //값에 따라 알아서 변하게 해줄 수 있다. if else 필요 x
        error,
      }; //변수를 배열로 받아서 깔끔하게 처리 새로운 방식이라 알아두기
    } catch (error) {
      return {
        error,
        ok: false,
      };
    }
  }
}
//에러처리 방법을 throw가아닌 직접 리턴을 사용하여 에러를 관리해준다.
//이 resolver가 하는 일은 오직 input 가지고 output을 보내는거 뿐이다.
