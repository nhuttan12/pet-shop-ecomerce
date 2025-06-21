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
import { ErrorMessage } from '@message/error-message';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger(CatchEverythingFilter.name);
  catch(exception: HttpException, host: ArgumentsHost): void {
    const httpAdapter = this.httpAdapterHost.httpAdapter as ExpressAdapter;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responsePayload =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            message: ErrorMessage.INTERNAL_SERVER_ERROR,
            error: (exception as Error)?.message,
          };

    const stack =
      exception instanceof HttpException
        ? exception.stack
        : (exception as Error).stack;

    this.logger.error(
      `[${request.method}] ${request.url} -> ${httpStatus}\nMessage: ${JSON.stringify(responsePayload)}\nStack: ${stack}`,
    );

    const resposneBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      ...(typeof responsePayload === 'object'
        ? responsePayload
        : { message: responsePayload }),
    };

    httpAdapter.reply(ctx.getResponse(), resposneBody, httpStatus);
  }
}
