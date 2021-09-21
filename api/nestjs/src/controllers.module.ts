import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { AdminUserController, UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';
import { JobsModule } from './jobs/jobs.module';
import { JobsController } from './jobs/jobs.controller';

@Module({
  imports: [AuthModule, UserModule, AwsModule, JobsModule, SearchModule],
  controllers: [
    AuthController,
    AdminUserController,
    JobsController,
    UserController,
  ],
})
export class ControllersModule {}
