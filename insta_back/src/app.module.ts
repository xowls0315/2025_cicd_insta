import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        schema: config.get<string>('DB_SCHEMA'),

        // ✅ entities 자동 로드
        autoLoadEntities: true,
        // 개발중 true 가능(실서비스는 false 추천)
        logging: true,
        // ✅ 너는 이미 SQL로 테이블 만들었으니 false
        synchronize: false,

        // ✅ Render Postgres 필수
        ssl: { rejectUnauthorized: false },
        extra: {
          ssl: { rejectUnauthorized: false },
        },
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
