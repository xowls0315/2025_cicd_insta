import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';

@Index('idx_refresh_tokens_expires_at', ['expiresAt'], {})
@Index('refresh_tokens_pkey', ['id'], { unique: true })
@Index('idx_refresh_tokens_user_id', ['userId'], {})
@Entity('refresh_tokens', { schema: 'insta' })
export class RefreshTokens {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'user_id' })
  userId: string;

  @Column('character varying', { name: 'token_hash', length: 255 })
  tokenHash: string;

  @Column('boolean', { name: 'is_revoked', default: () => 'false' })
  isRevoked: boolean;

  @Column('timestamp with time zone', { name: 'expires_at' })
  expiresAt: Date;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @ManyToOne(() => Users, (users) => users.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
