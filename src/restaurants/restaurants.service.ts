import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurants.entity';

//DB를 접근 가능
@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) //Restaurant entity의 repository를 inject
    private readonly restaurants: Repository<Restaurant>, //이름은 restaurants이고 Restaurant를 가지고 있는 Repository이다.
  ) {}
  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find(); //this.restaurants.를 했을 때 Repository에 접근해 모든걸 할 수 있다.
  } //find()는 async method여서 Promise를 써줘야한다.
}
//getAll()을 작성해서 모든 restaurant을 가져오는 service 만들기
//실제로 DB에 접근하는 방식을 작성
/* 
3.2 Injecting The Repository
1. TypeORM을 이용해서 Restaurant repository를 import
2. RestaurantService에서 repository를 사용하기 위해 service를 
RestaurantResolver에 import
3. RestaurantResolver는 this.restaurantService.getAll()을 return

정리
repository를 import하고 RestaurantService를 만들어서 RestaurantResolver에 import
RestaurantResolver가 restaurantService.getAll()을 return 하고
getAll()은 this.restaurants.find()를 return
모든 restaurant를 가져옴

3.3
전체 흐름: AppModule - TypeOrmModule - RestaurantsModule - RestaurantResolver - RestaurantService

1) TypeOrmModule에 DB로 전송할 entity들 설정

2) RestaurantsModule
: TypeOrmModule의 Restaurant 엔티티를 다른 곳에서 Inject할 수 있도록 import하기.
: providers에 RestaurantService 주입 => RestaurantResolver에서 사용 가능.

3) RestaurantService
: @InjectReposity(entity): 전달받은 entity를 기반으로 Repository 생성.
: Repository의 메서드들로 DB에 접근하는 방식 지정.

4) RestaurantResolver
: GraphQL Query/Mutation으로 DB에 접근하는 RestaurantService의 메서드들 활용.
*/
