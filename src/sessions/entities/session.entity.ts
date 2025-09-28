import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity('user_session')
export class UserSession {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Column('text')
  refreshToken: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Field({ nullable: true })
  @Column({ type: 'inet', nullable: true })
  ip: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
