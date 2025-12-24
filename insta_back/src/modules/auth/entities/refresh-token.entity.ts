import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('idx_refresh_tokens_user_id', ['userId'])
@Index('idx_refresh_tokens_expires_at', ['expiresAt'])
@Entity('refresh_tokens', { schema: 'insta' })
export class RefreshToken {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column('bigint', { name: 'user_id' })
  userId: number;

  @Column('character varying', { name: 'token_hash', length: 255 })
  tokenHash: string;

  @Column('boolean', { name: 'is_revoked', default: false })
  isRevoked: boolean;

  @Column('timestamp with time zone', { name: 'expires_at' })
  expiresAt: Date;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
