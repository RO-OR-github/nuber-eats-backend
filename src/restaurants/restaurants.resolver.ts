import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';

import { Restaurant } from './entities/restaurants.entity';
import { RestaurantService } from './restaurants.service';

@Resolver(() => Restaurant) //()안의 내용은 필수가 아니다.
export class RestaurantsResolver {
  constructor(private readonly restaurantServiece: RestaurantService) {} //serviec inject
  @Query((returns) => [Restaurant]) //GraphQL의 방법 []안에 이름
  restaurants(): Promise<Restaurant[]> {
    // restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    //TS의 방법  이름[]
    //@Args('veganOnly') GraphQL을 위한 부분
    // veganOnly: boolean function을 위한 부분
    //veganOnly: boolean 는 TS와 gql 모두에게 타입 적용
    return this.restaurantServiece.getAll();
  }
  @Mutation((returns) => Boolean)
  createRestaurant(
    @Args() createRestaurantDto: CreateRestaurantDto,
    //   @Args('isVegan') isVegan: boolean,
    //   @Args('address') address: string,
    //   @Args('ownerName') ownerName: string,
  ): boolean {
    console.log(createRestaurantDto);
    return true;
  }
}
//createRestaurunts 라는 mutation을 만든다.
//args로 받을 때
//Query데코레이터는 typeFunc를 받는다(ReturnTypeFunc) 즉 Query가 return하고자 하는 type을 return하는 function이어야한다.
//inputtype은 기본적으로 객체(클래스) 전체를 전달 받음.
//argsType은 각각을 받기 때문에 graphql에서 각각의 args가 뜸 inputtyp은 객체로 뜸
//1-4args정리 args를 각자쓰는방법, dto객체로 받는 방법, argstype 클래스로 각각 받는 법
