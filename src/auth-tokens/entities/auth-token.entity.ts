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
@Entity('auth_token')
@Unique(['purpose', 'token'])
export class AuthToken {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field()
  @Column('text')
  purpose: string;

  @Column('text')
  token: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  consumedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.authTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
