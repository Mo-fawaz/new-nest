import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './response/response.interceptor';
import { AllExceptionsFilter } from './all-exceptions/all-exceptions.filter';


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
app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
