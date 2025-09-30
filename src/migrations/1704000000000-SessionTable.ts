import { MigrationInterface, QueryRunner } from 'typeorm';

export class SessionTable1704000000000 implements MigrationInterface {
  name = 'SessionTable1704000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "session" (
        "id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "device_id" character varying(255) NOT NULL,
        "refresh_token_hash" text,
        "ip" character varying(255),
        "user_agent" character varying(512),
        "last_used_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "revoked_at" TIMESTAMP WITH TIME ZONE,
        "rotated_from_session_id" uuid,
        CONSTRAINT "PK_session_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_session_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_session_user_id" ON "session" ("user_id")'
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_session_device_user" ON "session" ("device_id", "user_id")'
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_session_expires_at" ON "session" ("expires_at")'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_session_expires_at"');
    await queryRunner.query('DROP INDEX "IDX_session_device_user"');
    await queryRunner.query('DROP INDEX "IDX_session_user_id"');
    await queryRunner.query('DROP TABLE "session"');
  }
}
