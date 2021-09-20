import { Injectable } from '@nestjs/common';
import { TypeOrmService } from '../common/typeorm.service';
import { Job } from './jobs.entity';

@Injectable()
export class JobsService extends TypeOrmService(Job) {}
