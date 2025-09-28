import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SeriesMembership } from './series-membership.entity';

@ObjectType()
@Entity('series')
export class Series {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'text', unique: true })
  title: string;

  // Relations
  @OneToMany(() => SeriesMembership, (membership) => membership.series)
  memberships: SeriesMembership[];
}
