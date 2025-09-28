import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { AuthProviderAccount } from '../../auth-provider-accounts/entities/auth-provider-account.entity';
import { UserSession } from '../../sessions/entities/session.entity';
import { AuthToken } from '../../auth-tokens/entities/auth-token.entity';
import { UserFollow } from '../../follows/entities/follow.entity';
import { Collection } from '../../collections/entities/collection.entity';
import { UserBook } from '../../user-books/entities/user-book.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Reaction } from '../../reactions/entities/reaction.entity';
import { ScanJob } from '../../scan-jobs/entities/scan-job.entity';
import { ImportJob } from '../../import-jobs/entities/import-job.entity';
import { ExportJob } from '../../export-jobs/entities/export-job.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { DevicePushToken } from '../../device-push-tokens/entities/device-push-token.entity';
import { MediaAsset } from '../../media-assets/entities/media-asset.entity';

@ObjectType()
@Entity('app_user')
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'citext', unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  emailVerified: Date;

  @Column({ type: 'text', nullable: true })
  passwordHash: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  displayName: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  avatarUrl: string;

  @Field()
  @Column({ type: 'text', default: 'fr' })
  locale: string;

  @Field()
  @Column({ type: 'text', default: 'public' })
  privacyLevel: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => AuthProviderAccount, (account) => account.user, {
    cascade: true
  })
  authProviderAccounts: AuthProviderAccount[];

  @OneToMany(() => UserSession, (session) => session.user, { cascade: true })
  sessions: UserSession[];

  @OneToMany(() => AuthToken, (token) => token.user, { cascade: true })
  authTokens: AuthToken[];

  @OneToMany(() => UserFollow, (follow) => follow.follower)
  following: UserFollow[];

  @OneToMany(() => UserFollow, (follow) => follow.followee)
  followers: UserFollow[];

  @OneToMany(() => Collection, (collection) => collection.user)
  collections: Collection[];

  @OneToMany(() => UserBook, (userBook) => userBook.user)
  userBooks: UserBook[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => ScanJob, (scanJob) => scanJob.user)
  scanJobs: ScanJob[];

  @OneToMany(() => ImportJob, (importJob) => importJob.user)
  importJobs: ImportJob[];

  @OneToMany(() => ExportJob, (exportJob) => exportJob.user)
  exportJobs: ExportJob[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => DevicePushToken, (token) => token.user)
  devicePushTokens: DevicePushToken[];

  @OneToMany(() => MediaAsset, (asset) => asset.ownerUser)
  mediaAssets: MediaAsset[];
}
