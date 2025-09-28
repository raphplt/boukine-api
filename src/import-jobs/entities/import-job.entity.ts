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
import { ImportSource, ImportStatus } from '../../common/enums';

@ObjectType()
@Entity('import_job')
export class ImportJob {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field(() => String)
  @Column({ type: 'enum', enum: ImportSource })
  source: ImportSource;

  @Field()
  @Column('text')
  fileKey: string;

  @Field(() => String)
  @Column({ type: 'enum', enum: ImportStatus, default: ImportStatus.PENDING })
  status: ImportStatus;

  @Field({ nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  summary: Record<string, any>;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.importJobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
