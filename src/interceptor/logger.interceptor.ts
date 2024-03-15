import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { User } from 'src/auth/entity/user.entity';
import { ApiAccessLogRepository } from 'src/auth/repository/api-access-log.repsitory';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(
    private readonly apiAccessLogRepository: ApiAccessLogRepository,
  ) {}
  private readonly logger = new Logger(LogInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const { ip, method, originalUrl } = request;
    const userAgent = request.headers['user-agent'] || '';
    const user = request.user as User;

    return next.handle().pipe(
      tap(async () => {
        try {
          await this.apiAccessLogRepository.creaetAccessLog(
            user,
            userAgent,
            `${method} ${originalUrl}`,
            ip,
          );
        } catch (err) {
          this.logger.error('fail to create access log');
        }
      }),
    );
  }
}
