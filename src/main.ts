import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './response/response.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false
      }
    })
  );
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
  })
);
  app.useGlobalInterceptors(
  new ResponseInterceptor()
);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
