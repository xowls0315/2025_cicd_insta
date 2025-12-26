import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { validationConfig } from './configs/validation.config';
import { ResponseFormatInterceptor } from './common/interceptor/response-format.interceptor';
import { AllExceptionFilter } from './common/filter/all-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe(validationConfig));
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
