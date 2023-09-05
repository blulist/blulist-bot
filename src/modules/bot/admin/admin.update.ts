import { Ctx, Hears, Update } from 'nestjs-telegraf';
import { UseFilters, UseGuards } from '@nestjs/common';
import { checkUserPermission } from '../shared/guards/user-permission.guard';
import { Context } from '../shared/interfaces/context.interface';
import { ExceptionsFilter } from '../shared/filters/exceptions.filter';
import { AdminBotService } from './services/admin-bot.service';

@Update()
@UseFilters(ExceptionsFilter)
export class AdminUpdate {
  constructor(private adminBotService: AdminBotService) {}

  @Hears(['/amar', 'آمار'])
  @UseGuards(checkUserPermission(['MANAGER', 'OWNER']))
  onAmarCmd(@Ctx() ctx: Context) {
    return this.adminBotService.getAmar(ctx);
  }
}
