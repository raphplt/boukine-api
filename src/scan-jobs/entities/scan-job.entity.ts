import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BookWork } from '../../works/entities/work.entity';
import { Edition } from '../../editions/entities/edition.entity';
import { ScanType, ScanStatus } from '../../common/enums';

@ObjectType()
@Entity('scan_job')
export class ScanJob {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Field(() => String)
  @Column({ type: 'enum', enum: ScanType })
  type: ScanType;

  @Field(() => String)
  @Column({ type: 'enum', enum: ScanStatus, default: ScanStatus.PENDING })
  status: ScanStatus;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  inputIsbn: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  inputFileKey: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  detectedIsbn: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  matchedWorkId: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  matchedEditionId: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  message: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.scanJobs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => BookWork, (work) => work.scanJobs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'matched_work_id' })
  matchedWork: BookWork;

  @ManyToOne(() => Edition, (edition) => edition.scanJobs, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'matched_edition_id' })
  matchedEdition: Edition;
}
