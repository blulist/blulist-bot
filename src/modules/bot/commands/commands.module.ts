import { Module } from '@nestjs/common';
import { CommandsUpdate } from './commands.update';

@Module({
  providers: [CommandsUpdate],
})
export class CommandsModule {}
