import { IsEmail } from 'class-validator';
import { TypeOrmEntity } from 'src/common/typeorm.entity';
import { Column, Entity } from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User extends TypeOrmEntity {
  @IsEmail()
  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column('enum', { enum: Role, default: Role.USER })
  role: Role;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;
}
