import { ResponseBody } from './response-body.interface';
import { ResponsePayload } from '@filters/response-payload.type';
import { ErrorMessage } from '@messages/error.messages';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger(CatchEverythingFilter.name);
  catch(exception: unknown, host: ArgumentsHost): void {
    const httpAdapter = this.httpAdapterHost.httpAdapter as ExpressAdapter;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    let httpStatus: number;
    let responsePayload: ResponsePayload | string;
    let stack: string | undefined;

    if (exception instanceof QueryFailedError) {
      // Error of TypeOrm
      const queryFailedError = exception as QueryFailedError;
      httpStatus = HttpStatus.UNPROCESSABLE_ENTITY; // 422
      responsePayload = {
        message: queryFailedError.message,
        detail: queryFailedError.driverError.message,
      };
      stack = exception.stack;
    } else if (exception instanceof EntityNotFoundError) {
      httpStatus = HttpStatus.NOT_FOUND; // 404
      responsePayload = {
        message: 'Entity not found',
        detail: exception.message,
      };
      stack = exception.stack;
    } else if (exception instanceof HttpException) {
      // HTTP Error of NestJS
      httpStatus = exception.getStatus();
      responsePayload = exception.getResponse();
      stack = exception.stack;
    } else if (exception instanceof Error) {
      // Undefined Error, deffault code is 500
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responsePayload = {
        message: ErrorMessage.INTERNAL_SERVER_ERROR,
        error: exception.message,
      };
      stack = exception.stack;
    } else {
      // Trường hợp khác (nếu có)
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responsePayload = {
        message: ErrorMessage.INTERNAL_SERVER_ERROR,
        error: 'Unknown error',
      };
      stack = undefined;
    }

    this.logger.error(
      `[${request.method}] ${request.url} -> ${httpStatus}\nMessage: ${JSON.stringify(responsePayload)}\nStack: ${stack}`,
    );

    let normalizedPayload: ResponsePayload;

    const message =
      typeof responsePayload === 'string'
        ? responsePayload
        : JSON.stringify(responsePayload);

    if (typeof responsePayload === 'object' && responsePayload !== null) {
      normalizedPayload = {
        ...responsePayload,
        message,
      };
    } else {
      normalizedPayload = {
        message: String(responsePayload),
      };
    }

    const responseBody: ResponseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      ...normalizedPayload,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
