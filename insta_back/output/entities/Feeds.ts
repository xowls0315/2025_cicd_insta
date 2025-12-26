import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';

@Index('feeds_created_at_idx', ['createdAt'], {})
@Index('feeds_pkey', ['id'], { unique: true })
@Index('feeds_user_id_fkey', ['userId'], {})
@Entity('feeds', { schema: 'insta' })
export class Feeds {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'user_id' })
  userId: string;

  @Column('text', { name: 'photo_url' })
  photoUrl: string;

  @Column('text', { name: 'description' })
  description: string;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'now()',
  })
  updatedAt: Date | null;

  @ManyToOne(() => Users, (users) => users.feeds, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
