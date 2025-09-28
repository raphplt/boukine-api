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
@Entity('notification')
export class Notification {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field()
  @Column('text')
  type: string;

  @Field()
  @Column('jsonb')
  payload: Record<string, any>;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  readAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
