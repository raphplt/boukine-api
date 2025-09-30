import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReactionType } from '../../common/enums';

@ObjectType()
@Entity('reaction')
@Unique(['userId', 'entityType', 'entityId'])
export class Reaction {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field()
  @Column('text')
  entityType: string;

  @Field()
  @Column('uuid')
  entityId: string;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: ReactionType,
    enumName: 'reaction_type',
    default: ReactionType.LIKE
  })
  type: ReactionType;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.reactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Note: entityType/entityId est polymorphique - pas de relation TypeORM directe
  // Les relations sont gérées dans les services métier
}
