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
@Entity('device_push_token')
@Unique(['platform', 'token'])
export class DevicePushToken {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field()
  @Column('text')
  platform: string;

  @Field()
  @Column('text')
  token: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.devicePushTokens, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
