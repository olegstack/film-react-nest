import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { JsonLogger } from './loggers/json.logger';
import { TskvLogger } from './loggers/tskv.logger';
import { DevLogger } from './loggers/dev.logger';
// import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // ✅ импортируем Express адаптер

async function bootstrap() {
  // ✅ создаем приложение именно как NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // выбор логгера
  let logger;
  switch (process.env.LOGGER_TYPE) {
    case 'json':
      logger = new JsonLogger();
      break;
    case 'tskv':
      logger = new TskvLogger();
      break;
    default:
      logger = new DevLogger();
  }

  app.useLogger(logger);
  logger.log('Custom logger initialized', 'Bootstrap');

  // // ✅ раздача статических файлов (теперь useStaticAssets работает)
  // app.useStaticAssets(join(__dirname, '..', 'public'), {
  //   prefix: '/content/',
  // });

  // Префикс API
  app.setGlobalPrefix('api/afisha', {
    exclude: [
      {
        path: 'content/afisha/(.*)',
        method: RequestMethod.ALL,
      },
    ],
  });

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(3000);
}

bootstrap();
