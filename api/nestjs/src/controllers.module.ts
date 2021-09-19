import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { AdminUserController, UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, AwsModule],
  controllers: [
    AuthController,
    AdminUserController,
    UserController,
  ],
})
export class ControllersModule {}
