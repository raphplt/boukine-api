import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index
} from 'typeorm';
import { BookWorkAuthor } from './book-work-author.entity';
import { SeriesMembership } from '../../series/entities/series-membership.entity';
import { Edition } from '../../editions/entities/edition.entity';
import { BookIdentifier } from '../../book-identifiers/entities/book-identifier.entity';
import { UserBook } from '../../user-books/entities/user-book.entity';
import { CollectionItem } from '../../collection-items/entities/collection-item.entity';
import { Review } from '../../reviews/entities/review.entity';
import { ScanJob } from '../../scan-jobs/entities/scan-job.entity';

@ObjectType()
@Entity('book_work')
export class BookWork {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text')
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  subtitle: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  language: string;

  @Field(() => [String], { nullable: true })
  @Column({ type: 'text', array: true, nullable: true })
  subjects: string[];

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  coverImageUrl: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @OneToMany(() => BookWorkAuthor, (bookWorkAuthor) => bookWorkAuthor.work)
  authors: BookWorkAuthor[];

  @OneToMany(() => SeriesMembership, (membership) => membership.work)
  seriesMemberships: SeriesMembership[];

  @OneToMany(() => Edition, (edition) => edition.work)
  editions: Edition[];

  @OneToMany(() => BookIdentifier, (identifier) => identifier.work)
  identifiers: BookIdentifier[];

  @OneToMany(() => UserBook, (userBook) => userBook.work)
  userBooks: UserBook[];

  @OneToMany(() => CollectionItem, (item) => item.work)
  collectionItems: CollectionItem[];

  @OneToMany(() => Review, (review) => review.work)
  reviews: Review[];

  @OneToMany(() => ScanJob, (scanJob) => scanJob.matchedWork)
  scanJobs: ScanJob[];
}

// Index added via migration for trigram search
@Index('book_work_title_trgm', { synchronize: false })
export class BookWorkTitleIndex {}
