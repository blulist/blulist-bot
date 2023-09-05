import { Controller, Get, Param } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('/telegram')
export class TelegramController {
  constructor(private telService: TelegramService) {}
  @Get('file-url/:file_id')
  onGetFileUrl(@Param('file_id') file_id: string) {
    return this.telService.getFileUrl(file_id);
  }
}
