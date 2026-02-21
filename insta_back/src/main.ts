import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { validationConfig } from './configs/validation.config';
import { ResponseFormatInterceptor } from './common/interceptor/response-format.interceptor';
import { AllExceptionFilter } from './common/filter/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  // Swagger UI 설정
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Instagram Clone API')
    .setDescription('Instagram Clone 프로젝트 REST API 문서')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' },
      'access-token',
    )
    .addTag('auth', '인증 (로그인, 로그아웃, 토큰 갱신)')
    .addTag('users', '사용자 (회원가입, 프로필, ID/PW 찾기)')
    .addTag('feeds', '피드 (CRUD)')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  const allowedOrigins = corsOrigin
    ? corsOrigin.split(',').map((o) => o.trim())
    : ['http://localhost:3000'];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe(validationConfig));
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
