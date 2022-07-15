import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

//transform은 원하는 타입으로 바꿔줌(url은 스트링이지만 우리가 원하는 number로 받게 해줌)
//설치 필요 npm i class-transformer
