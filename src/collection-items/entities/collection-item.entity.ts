import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique
} from 'typeorm';
import { Collection } from '../../collections/entities/collection.entity';
import { BookWork } from '../../works/entities/work.entity';

@ObjectType()
@Entity('collection_item')
@Unique(['collectionId', 'workId'])
export class CollectionItem {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  collectionId: string;

  @Field()
  @Column('uuid')
  workId: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  position: number;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  addedAt: Date;

  // Relations
  @ManyToOne(() => Collection, (collection) => collection.items, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;

  @ManyToOne(() => BookWork, (work) => work.collectionItems, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'work_id' })
  work: BookWork;
}
