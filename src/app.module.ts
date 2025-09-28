import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthProviderAccountsModule } from './auth-provider-accounts/auth-provider-accounts.module';
import { SessionsModule } from './sessions/sessions.module';
import { AuthTokensModule } from './auth-tokens/auth-tokens.module';
import { FollowsModule } from './follows/follows.module';
import { AuthorsModule } from './authors/authors.module';
import { PublishersModule } from './publishers/publishers.module';
import { SeriesModule } from './series/series.module';
import { WorksModule } from './works/works.module';
import { EditionsModule } from './editions/editions.module';
import { BookIdentifiersModule } from './book-identifiers/book-identifiers.module';
import { CollectionsModule } from './collections/collections.module';
import { UserBooksModule } from './user-books/user-books.module';
import { CollectionItemsModule } from './collection-items/collection-items.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ScanJobsModule } from './scan-jobs/scan-jobs.module';
import { ImportJobsModule } from './import-jobs/import-jobs.module';
import { ExportJobsModule } from './export-jobs/export-jobs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DevicePushTokensModule } from './device-push-tokens/device-push-tokens.module';
import { MediaAssetsModule } from './media-assets/media-assets.module';

@Module({
  imports: [AuthModule, UsersModule, AuthProviderAccountsModule, SessionsModule, AuthTokensModule, FollowsModule, AuthorsModule, PublishersModule, SeriesModule, WorksModule, EditionsModule, BookIdentifiersModule, CollectionsModule, UserBooksModule, CollectionItemsModule, ReviewsModule, ReactionsModule, ScanJobsModule, ImportJobsModule, ExportJobsModule, NotificationsModule, DevicePushTokensModule, MediaAssetsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
