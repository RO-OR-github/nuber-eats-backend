import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

type AllowedRoles = keyof typeof UserRole | 'Any';
export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
//authorization은 이 resource에 접근할 수 있냐고 물어보는 것
