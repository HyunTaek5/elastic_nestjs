import {
  BadRequestException,
  Body,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Type,
} from '@nestjs/common';
import { RepositoryService } from './repository.service';

export interface RestAdminController<Service> {
  readonly service: Service;
}

export function RestAdminController<Service extends RepositoryService<any>>(
  repositoryService: Type<Service>,
): Type<RestAdminController<Service>> {
  class RestAdminControllerHost implements RestAdminController<Service> {
    @Inject(repositoryService) readonly service: Service;

    /**
     * @example
     * /items
     * /items?page=1&limit=25
     * /items?page=1&limit=25&filter[type]=SOMETHING&sort[id]=DESC
     */
    @Get()
    find(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number,
      @Query('filter') filter: any,
      @Query('sort') sort: any,
    ) {
      return this.service.findByPage(page, limit, { filter, sort });
    }

    /**
     * @example
     * GET /items/1
     * GET /items/1,2,3
     */
    @Get(':ids')
    findByIds(
      @Param('ids', new ParseArrayPipe({ items: Number })) ids: number[],
    ) {
      if (ids.length === 1) {
        return this.service.findById(ids[0]);
      }
      return this.service.findByIds(ids);
    }

    /**
     * @example
     * POST /items
     */
    @Post()
    create(@Body() data: any) {
      if (data.id)
        throw new BadRequestException(
          'Cannot create resource with specific id',
        );
      return this.service.save(data);
    }

    /**
     * @example
     * PATCH /items/1
     * PATCH /items/1,2,3
     */
    @Patch(':ids')
    update(
      @Param('ids', new ParseArrayPipe({ items: Number })) ids: number[],
      @Body() data: any,
    ) {
      return this.service.saveMany(ids.map((id) => ({ ...data, id })));
    }

    /**
     * @example
     * DELETE /items/1
     * DELETE /items/1,2,3
     */
    @Delete(':ids')
    async delete(
      @Param('ids', new ParseArrayPipe({ items: Number })) ids: number[],
    ) {
      await this.service.deleteByIds(ids);
    }
  }
  return RestAdminControllerHost;
}
