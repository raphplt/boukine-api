import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity('export_job')
export class ExportJob {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field()
  @Column('text')
  format: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  fileKey: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  readyAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.exportJobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
