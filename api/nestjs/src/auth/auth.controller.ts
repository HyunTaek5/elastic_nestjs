import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() user: User) {
    return this.service.signup(user);
  }

  @Public()
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  login(@CurrentUser() user: User) {
    return this.service.login(user.id);
  }
}
