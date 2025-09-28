import { ObjectType, Field, Int } from '@nestjs/graphql';
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
@Entity('media_asset')
export class MediaAsset {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  ownerUserId: string;

  @Field()
  @Column('text')
  kind: string;

  @Field()
  @Column('text')
  storageKey: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  contentType: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  width: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  height: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'bigint', nullable: true })
  sizeBytes: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  sha256Hex: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.mediaAssets, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_user_id' })
  ownerUser: User;
}
