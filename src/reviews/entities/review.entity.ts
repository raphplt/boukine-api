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

@ObjectType()
@Entity('review')
@Unique(['userId', 'workId'])
@Check('rating BETWEEN 1 AND 5')
export class Review {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field()
  @Column('uuid')
  workId: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'smallint', nullable: true })
  rating: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  body: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => BookWork, (work) => work.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'work_id' })
  work: BookWork;
}
