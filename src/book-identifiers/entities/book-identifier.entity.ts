import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Check,
  Unique
} from 'typeorm';
import { BookWork } from '../../works/entities/work.entity';
import { Edition } from '../../editions/entities/edition.entity';

@ObjectType()
@Entity('book_identifier')
@Check('(work_id IS NOT NULL) OR (edition_id IS NOT NULL)')
@Unique(['scheme', 'value'])
export class BookIdentifier {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  workId: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  editionId: string;

  @Field()
  @Column('text')
  scheme: string;

  @Field()
  @Column('text')
  value: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => BookWork, (work) => work.identifiers, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'work_id' })
  work: BookWork;

  @ManyToOne(() => Edition, (edition) => edition.identifiers, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'edition_id' })
  edition: Edition;
}
