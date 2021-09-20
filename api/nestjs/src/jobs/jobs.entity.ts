import { Column, Entity } from 'typeorm';
import { TypeOrmEntity } from '../common/typeorm.entity';

@Entity()
export class Job extends TypeOrmEntity {
  @Column()
  jobName: string;

  @Column()
  company: string;

  @Column()
  region: string;

  @Column()
  applyLink: string;
}
