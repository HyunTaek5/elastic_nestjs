import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsService } from './aws.service';

@Module({
  providers: [AwsService, ConfigService],
  exports: [AwsService],
})
export class AwsModule {}
