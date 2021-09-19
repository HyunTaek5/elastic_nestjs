import {
  BadRequestException,
  Inject,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, ILike, In, Repository } from 'typeorm';
import {
  DeepPartial,
  FindOptions,
  RepositoryService,
} from './repository.service';

export interface TypeOrmService<Entity> extends RepositoryService<Entity> {
  readonly connection: Connection;
  readonly repository: Repository<Entity>;
}

export function TypeOrmService<Entity>(
  entity: Type<Entity>,
): Type<TypeOrmService<Entity>> {
  class TypeOrmServiceHost implements TypeOrmService<Entity> {
    @Inject() readonly connection: Connection;
    @InjectRepository(entity) readonly repository: Repository<Entity>;

    private parseFilter(filter: any) {
      if (!filter) return undefined;
      return Object.entries<any>(filter).reduce((where, [key, value]) => {
        if (Array.isArray(value)) {
          where[key] = In(value);
        } else if (value.hasOwnProperty('ilike')) {
          where[key] = ILike(`%${value.ilike}%`);
        } else {
          where[key] = value;
        }
        return where;
      }, {} as any);
    }

    async findById(id: number) {
      if (!id) throw new BadRequestException();
      const one = await this.repository.findOne(id);
      if (one) return one;
      throw new NotFoundException();
    }

    findByIds(ids: number[]) {
      return this.repository.findByIds(ids);
    }

    findAll() {
      return this.repository.find();
    }

    async findByPage(page: number, limit: number, options: FindOptions = {}) {
      const { filter, sort } = options;
      const [items, total] = await this.repository.findAndCount({
        skip: (page - 1) * limit,
        take: Math.min(limit, 1000),
        where: this.parseFilter(filter),
        order: sort,
      });
      return { items, total };
    }

    async findByOffset(
      offset: number,
      limit: number,
      options: FindOptions = {},
    ) {
      const { filter, sort } = options;
      const [items, total] = await this.repository.findAndCount({
        skip: offset,
        take: Math.min(limit, 1000),
        where: this.parseFilter(filter),
        order: sort,
      });
      return { items, total };
    }

    save<T extends DeepPartial<Entity>>(entity: T) {
      return this.repository.save(entity);
    }

    saveMany<T extends DeepPartial<Entity>>(entities: T[]) {
      return this.repository.save(entities);
    }

    async deleteById(id: number) {
      await this.repository.delete(id);
    }

    async deleteByIds(ids: number[]) {
      await this.repository.delete(ids);
    }
  }
  return TypeOrmServiceHost;
}
