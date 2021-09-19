import { Inject, Type } from '@nestjs/common';
import { RepositoryService } from './repository.service';

export interface RestController<Service> {
  readonly service: Service;
}

export function RestController<Service extends RepositoryService<any>>(
  repositoryService: Type<Service>,
): Type<RestController<Service>> {
  class RestControllerHost implements RestController<Service> {
    @Inject(repositoryService) readonly service: Service;
  }
  return RestControllerHost;
}
