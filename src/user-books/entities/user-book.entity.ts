import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Check
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BookWork } from '../../works/entities/work.entity';
import { Edition } from '../../editions/entities/edition.entity';
import { ReadingStatus } from '../../common/enums';

@ObjectType()
@Entity('user_book')
@Unique(['userId', 'workId'])
@Check('rating BETWEEN 1 AND 5')
export class UserBook {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field()
  @Column('uuid')
  workId: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  preferredEditionId: string;

  @Field(() => String)
  @Column({ type: 'enum', enum: ReadingStatus, default: ReadingStatus.TO_READ })
  status: ReadingStatus;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'smallint', nullable: true })
  rating: number;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  startedAt: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  finishedAt: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  owned: boolean;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Field(() => [String], { nullable: true })
  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.userBooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => BookWork, (work) => work.userBooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'work_id' })
  work: BookWork;

  @ManyToOne(() => Edition, (edition) => edition.userBooksAsPreferred, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'preferred_edition_id' })
  preferredEdition: Edition;
}
