import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Edition } from '../../editions/entities/edition.entity';

@ObjectType()
@Entity('publisher')
export class Publisher {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'text', unique: true })
  name: string;

  // Relations
  @OneToMany(() => Edition, (edition) => edition.publisher)
  editions: Edition[];
}
