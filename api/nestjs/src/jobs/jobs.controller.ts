import { Controller } from '@nestjs/common';
import { RestController } from '../common/rest.controller';
import { JobsService } from './jobs.service';

@Controller()
export class JobsController extends RestController(JobsService) {}
