import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from '../interfaces/context.interface';

export function checkPlaylistPermission(): any {
  class _checkPlaylistPermission implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const ctxCreate = TelegrafExecutionContext.create(context);
      const ctx = ctxCreate.getContext<Context>();
      return true;
    }
  }

  return _checkPlaylistPermission;
}
