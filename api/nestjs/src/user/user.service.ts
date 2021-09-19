import { Injectable } from '@nestjs/common';
import { TypeOrmService } from 'src/common/typeorm.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from './user.entity';

@Injectable()
export class UserService extends TypeOrmService(User) {
  async existsByEmail(email: string) {
    const count = await this.repository.count({ email });
    return count > 0;
  }

  findByEmail(email: string) {
    return this.repository.findOne({ email });
  }

  findByEmailIncludingPassword(email: string) {
    return this.repository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  updateByIds(ids: number[], data: QueryDeepPartialEntity<User>) {
    return this.repository.update(ids, data);
  }
}
