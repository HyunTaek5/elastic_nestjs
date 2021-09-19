import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Public } from 'src/auth/public.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RestAdminController } from 'src/common/rest-admin.controller';
import { RestController } from 'src/common/rest.controller';
import { UserUpdateDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Roles('ADMIN')
@Controller('admin/users')
export class AdminUserController extends RestAdminController(UserService) {}

@Controller('users')
export class UserController extends RestController(UserService) {
  @Get('me')
  me(@CurrentUser() user: User) {
    return user;
  }

  @Public()
  @Post('exists')
  exists(@Body('email') email: string) {
    return this.service.existsByEmail(email);
  }

  @Patch('/update')
  async updateUser(
    @CurrentUser() user,
    @Body() { email, name, description }: UserUpdateDto,
  ) {
    const request = { email, name, description };
    await this.service.updateByIds([user.id], request);
  }

  @Delete('')
  async deleteUser(@CurrentUser() user) {
    return this.service.deleteById(user.id);
  }

  @Get('/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
