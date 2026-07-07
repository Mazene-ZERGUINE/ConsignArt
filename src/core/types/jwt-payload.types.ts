import { UserRole } from '../../shared/enums/user-roles.enum';

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};
