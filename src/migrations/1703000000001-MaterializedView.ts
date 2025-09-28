import { MigrationInterface, QueryRunner } from 'typeorm';

export class MaterializedView1703000000001 implements MigrationInterface {
  name = 'MaterializedView1703000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create materialized view for search
    await queryRunner.query(`
      DROP MATERIALIZED VIEW IF EXISTS mv_work_search;
      CREATE MATERIALIZED VIEW mv_work_search AS
      SELECT
        w.id,
        unaccent(lower(w.title)) AS title_norm,
        COALESCE(string_agg(a.name, ' ' ORDER BY bwa.position), '') AS authors_str,
        setweight(to_tsvector('simple', coalesce(w.title,'')), 'A') ||
        setweight(to_tsvector('simple', coalesce(string_agg(a.name,' '),'')), 'B') AS ts
      FROM book_work w
      LEFT JOIN book_work_author bwa ON bwa.work_id = w.id
      LEFT JOIN author a ON a.id = bwa.author_id
      GROUP BY w.id;
    `);

    // Create index on materialized view
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS mv_work_search_ts_idx ON mv_work_search USING GIN (ts);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP MATERIALIZED VIEW IF EXISTS mv_work_search CASCADE`
    );
  }
}
