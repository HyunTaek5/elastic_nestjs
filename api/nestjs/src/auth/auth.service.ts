import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
import { Role, User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(user: User) {
    if (user.role === Role.ADMIN) throw new ForbiddenException();
    const databaseUser = await this.usersService.findByEmail(user.email);
    if (databaseUser) throw new ConflictException();
    user.password = await hash(user.password, 10);
    const { id } = await this.usersService.save(user);
    return this.login(id);
  }

  async login(userId: number) {
    const payload = { sub: userId };
    return { token: this.jwtService.sign(payload) };
  }
}
