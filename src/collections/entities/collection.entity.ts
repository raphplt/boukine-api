import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  Unique
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CollectionItem } from '../../collection-items/entities/collection-item.entity';

@ObjectType()
@Entity('collection')
@Unique(['userId', 'name'])
export class Collection {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Field()
  @Column({ type: 'text', default: 'private' })
  privacyLevel: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  position: number;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.collections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CollectionItem, (item) => item.collection)
  items: CollectionItem[];
}
