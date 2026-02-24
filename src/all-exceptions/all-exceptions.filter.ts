import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from 'src/generated/prisma/internal/prismaNamespace';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    // NestJS HttpException
    if (exception instanceof HttpException) {

      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message;

    }

    // Prisma errors
    else if (exception instanceof PrismaClientKnownRequestError) {

      switch (exception.code) {

        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Duplicate field value';
          break;

        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;

        default:
          message = exception.message;

      }

    }

    // unknown errors
    else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({

      success: false,

      statusCode: status,

      path: request.url,

      method: request.method,

      message,

      timestamp: new Date().toISOString(),

    });

  }

}