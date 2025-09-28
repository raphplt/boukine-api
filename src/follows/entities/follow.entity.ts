import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryColumn,
  Check
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity('user_follow')
@Check('follower_id <> followee_id')
export class UserFollow {
  @Field()
  @PrimaryColumn('uuid')
  followerId: string;

  @Field()
  @PrimaryColumn('uuid')
  followeeId: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'followee_id' })
  followee: User;
}
