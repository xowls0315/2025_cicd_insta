import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Feeds } from "./Feeds";
import { RefreshTokens } from "./RefreshTokens";

@Index("users_pkey", ["id"], { unique: true })
@Index("users_username_key", ["username"], { unique: true })
@Entity("users", { schema: "insta" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "username", unique: true, length: 30 })
  username: string;

  @Column("character varying", { name: "nickname", length: 30 })
  nickname: string;

  @Column("character varying", { name: "password_hash", length: 255 })
  passwordHash: string;

  @Column("text", { name: "profile_image_url", nullable: true })
  profileImageUrl: string | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date;

  @OneToMany(() => Feeds, (feeds) => feeds.user)
  feeds: Feeds[];

  @OneToMany(() => RefreshTokens, (refreshTokens) => refreshTokens.user)
  refreshTokens: RefreshTokens[];
}
