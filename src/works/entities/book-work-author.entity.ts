import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { BookWork } from './work.entity';
import { Author } from '../../authors/entities/author.entity';

@ObjectType()
@Entity('book_work_author')
export class BookWorkAuthor {
  @Field()
  @PrimaryColumn('uuid')
  workId: string;

  @Field()
  @PrimaryColumn('uuid')
  authorId: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  position: number;

  // Relations
  @ManyToOne(() => BookWork, (work) => work.authors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'work_id' })
  work: BookWork;

  @ManyToOne(() => Author, (author) => author.bookWorks, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'author_id' })
  author: Author;
}
