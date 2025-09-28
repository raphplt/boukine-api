import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  Index,
  Unique
} from 'typeorm';
import { BookWork } from '../../works/entities/work.entity';
import { Publisher } from '../../publishers/entities/publisher.entity';
import { BookIdentifier } from '../../book-identifiers/entities/book-identifier.entity';
import { UserBook } from '../../user-books/entities/user-book.entity';
import { ScanJob } from '../../scan-jobs/entities/scan-job.entity';

@ObjectType()
@Entity('edition')
@Unique(['isbn13'])
@Unique(['isbn10'])
export class Edition {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  workId: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  isbn10: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  isbn13: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  ean: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  format: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  pageCount: number;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  publishDate: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  publisherId: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  language: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  coverImageUrl: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  dimensions: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  weightGrams: number;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => BookWork, (work) => work.editions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'work_id' })
  work: BookWork;

  @ManyToOne(() => Publisher, (publisher) => publisher.editions, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'publisher_id' })
  publisher: Publisher;

  @OneToMany(() => BookIdentifier, (identifier) => identifier.edition)
  identifiers: BookIdentifier[];

  @OneToMany(() => UserBook, (userBook) => userBook.preferredEdition)
  userBooksAsPreferred: UserBook[];

  @OneToMany(() => ScanJob, (scanJob) => scanJob.matchedEdition)
  scanJobs: ScanJob[];
}

// Unique index for editions without ISBN - added via migration
@Index('uniq_edition_fallback', { synchronize: false })
export class EditionFallbackIndex {}
