import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggingService } from '../../../logging/logging.service';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { Context } from '../interfaces/context.interface';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggingService: LoggingService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const telegrafHost = TelegrafArgumentsHost.create(context);
    const ctx = telegrafHost.getContext<Context>();
    return next.handle().pipe(
      tap(() => {
        try {
          let msg = `new request\n\n`;
          if (ctx.callbackQuery) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const data = ctx.callbackQuery.data;
            msg += `
            user: @${ctx.from.username} | ${ctx.from.id}
            queryData: ${data}`;
          } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const content = ctx.update.message.text;
            msg += `
            user: @${ctx.from.username} | ${ctx.from.id}
            content: ${content}
            `;
          }
          this.loggingService.log(msg);
        } catch (e) {}
      }),
    );
  }
}
