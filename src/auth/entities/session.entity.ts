import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity('session')
@Index(['userId'])
@Index(['deviceId', 'userId'])
@Index(['expiresAt'])
export class Session {
  @Field()
  @PrimaryColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  deviceId: string;

  @Column({ type: 'text', nullable: true })
  refreshTokenHash: string | null;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  ip: string | null;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 512, nullable: true })
  userAgent: string | null;

  @Field()
  @Column({ type: 'timestamptz' })
  lastUsedAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field()
  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  revokedAt: Date | null;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  rotatedFromSessionId: string | null;

  @ManyToOne(() => User, (user: User) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
