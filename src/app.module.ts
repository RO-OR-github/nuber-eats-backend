import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import * as Joi from 'joi'; //ts가아닌 js로 만들어졌기 때문에 이런식으로 import해준다.
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { Restaurant } from './restaurants/entities/restaurants.entity';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { Category } from './restaurants/entities/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //어플리케이션 어디서나 config 모듈에 접근 가능
      envFilePath: process.env.NODE_ENV == 'dev' ? '.env.dev' : '.env.test', //이부분을 틀리면 안된다.
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // prod일때는 환경변수파일 무시
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(), //npm run start:dev 다시 실행
        DB_HOST: Joi.string().required(), //env파일 모듀 유효성 검사
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        // process.env.NODE_ENV가 가상변수 dev이면 .dev.en 아니면 .test.env
        //test, development, production 환경을 각각 쓰기 위해 //각각의 환경을 위한 파일 만듬
        //커멘드에 따라 환경변수 만들기
        //cross-env 로 가상변수 설정
        //env를 .gitignore 에 추가 깃허브에 올릴 필요가 없는 부분이므로
      }), //Joi를 이용해서 유효성 검사 하는법, NestJS공식 문서에 나와있다
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, //alt shift 복붙 아래로,ctrl alt 화살표 로 창옮길수도 있음
      port: +process.env.DB_PORT, //string앞에 +를 붙이면 nuber로 바꿔줌 (숫자형식일때)
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD, //localhost로연결 하면 물어보지않음
      database: process.env.DB_NAME, //ctrl d shift 활용으로 한번에 수정
      synchronize: process.env.NODE_ENV !== 'prod', //기본적으로 env에서 가져오는 변수는 모두 스트링
      logging: process.env.NODE_ENV !== 'prod',
      entities: [User, Restaurant, Category], //User 엔티티 사용 typeorm 모듈에 추가
    }), //TypeOrm 모듈을 NestSJ로 설치후 데이터베이스연결
    //환경변수 파일(.env)을 Node.js에서 이용하는 방법은 dotenv를 이용 하는 거
    //NestJs에서는 config를 활용 이 모듈은 dotnev 최상위에서 실행
    // RestaurantsModule, => 비활성화
    UsersModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
