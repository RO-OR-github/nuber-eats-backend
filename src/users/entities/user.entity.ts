import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity } from 'typeorm';

type UserRole = 'client' | 'owner' | 'delivery'; //타입

@Entity()
export class User extends CoreEntity {
  //기본적인 부분은 반복하기 싫으므로 확장을 하여 사용
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole; //client, owner, delivery중 하나
}
/*
4.1
모든entity들은 ID, createdAt, updateAt를 가진다.
common 모듈을 만들어 기본적으로 공유되는 모든 것을 적용한다.
*/
