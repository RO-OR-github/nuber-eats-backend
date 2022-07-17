import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
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
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
    //   @Args('isVegan') isVegan: boolean,
    //   @Args('address') address: string,
    //   @Args('ownerName') ownerName: string,
  ): Promise<boolean> {
    //async function을 쓸 때는 Promise아 value를 써야 한다.
    try {
      await this.restaurantServiece.createRestaurant(createRestaurantDto);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  @Mutation((returns) => Boolean)
  async updateRestaurant(
    @Args('input') updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    //Promise이다 boolean 타입인
    try {
      await this.restaurantServiece.updateRestaurant(updateRestaurantDto); //기다린다, 서비스.업데이트(업데이트레스토랑DTO를 받는 - InputType이다.)
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  } //update는 없는것도 실행은 한다.
  /*
 3.7
resolver, mutation에 어떤 restaurant을 수정할건지 알려주기 위해 
id를 보내야 한다.

방법 1번
    @Args('id') id:number
    @Args('data') data: UpdateRestaurantDTO 

방법 2번
DTO를 하나만 만드는 방법(arg를 적게 주기위해)
updatedto 파일에서 클래스를 Inputtype으로 수정 및 ArgsTyp 클래스추가

@InputType()
export class UpdateRestaurantInputType extends PartialType(
  CreateRestaurantDto,
) {}

@ArgsType()
export class UpdateRestaurantDto {  //추가
  @Field((type) => Number)
  id: number;

  @Field((type) => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}

그런 후 위와 같이 ArgsType 데코레이터와 필드들을 작성

inputtype은 datafield에 있고 datafield는 UpdateRestaurantDto에 있다.

inputtype을 쓸때는 @Args('input') ArgsType은 @Args()로 써야 한다.
  */
}
//createRestaurunts 라는 mutation을 만든다.
//args로 받을 때
//Query데코레이터는 typeFunc를 받는다(ReturnTypeFunc) 즉 Query가 return하고자 하는 type을 return하는 function이어야한다.
//inputtype은 기본적으로 객체(클래스) 전체를 전달 받음.
//argsType은 각각을 받기 때문에 graphql에서 각각의 args가 뜸 inputtyp은 객체로 뜸
//1-4args정리 args를 각자쓰는방법, dto객체로 받는 방법, argstype 클래스로 각각 받는 법
