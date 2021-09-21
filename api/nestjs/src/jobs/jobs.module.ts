import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './jobs.entity';
import { JobsService } from './jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
