import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity('auth_provider_account')
@Unique(['provider', 'providerId'])
export class AuthProviderAccount {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field()
  @Column('text')
  provider: string;

  @Field()
  @Column('text')
  providerId: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.authProviderAccounts, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
