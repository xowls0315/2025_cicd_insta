import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { Feed } from 'src/modules/feeds/entities/feed.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('users_username_key', ['username'], { unique: true })
@Entity('users', { schema: 'insta' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column('character varying', { name: 'username', length: 30, unique: true })
  username: string;

  @Column('character varying', { name: 'nickname', length: 30 })
  nickname: string;

  @Column('character varying', { name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column('text', { name: 'profile_image_url', nullable: true })
  profileImageUrl: string | null;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Feed, (feed) => feed.user)
  feeds: Feed[];
}
