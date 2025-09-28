import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Series } from './series.entity';
import { BookWork } from '../../works/entities/work.entity';

@ObjectType()
@Entity('series_membership')
export class SeriesMembership {
  @Field()
  @PrimaryColumn('uuid')
  seriesId: string;

  @Field()
  @PrimaryColumn('uuid')
  workId: string;

  @Field({ nullable: true })
  @Column({ type: 'decimal', nullable: true })
  numberInSeries: number;

  // Relations
  @ManyToOne(() => Series, (series) => series.memberships, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'series_id' })
  series: Series;

  @ManyToOne(() => BookWork, (work) => work.seriesMemberships, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'work_id' })
  work: BookWork;
}
