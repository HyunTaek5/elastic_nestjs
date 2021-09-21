import { Column, Entity } from 'typeorm';
import { TypeOrmEntity } from '../common/typeorm.entity';

export enum Type {
  SARAMIN = 'SARAMIN',
  INDEED = 'INDEED',
}

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

  @Column('enum', { enum: Type, default: Type.INDEED })
  type: Type;
}
