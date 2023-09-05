import { CanActivate, ExecutionContext } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from '../interfaces/context.interface';
import { UserPermissionType } from '../interfaces/user.interface';

export function checkUserPermission(
  permissions: Array<UserPermissionType> = [],
): any {
  class _checkPlaylistPermission implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<any> {
      const ctxCreate = TelegrafExecutionContext.create(context);
      const ctx = ctxCreate.getContext<Context>();
      const msg = `⛔ شما دسترسی لازم رو برای این کار ندارید!`;
      if (permissions.length) {
        const user = ctx.user;
        const hasPermission = user.permissions.some((permission) =>
          permissions.includes(permission),
        );
        if (!hasPermission) throw new TelegrafException(msg);
      }
      return true;
    }
  }

  return _checkPlaylistPermission;
}
