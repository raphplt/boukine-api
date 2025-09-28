import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index
} from 'typeorm';
import { BookWorkAuthor } from '../../works/entities/book-work-author.entity';

@ObjectType()
@Entity('author')
export class Author {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text')
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  sortKey: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  bio: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  birthYear: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  deathYear: number;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @OneToMany(() => BookWorkAuthor, (bookWorkAuthor) => bookWorkAuthor.author)
  bookWorks: BookWorkAuthor[];
}

// Index added via migration for trigram search
@Index('author_name_trgm', { synchronize: false })
export class AuthorNameIndex {}
