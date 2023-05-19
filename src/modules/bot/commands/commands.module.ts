import { Module } from '@nestjs/common';
import { CommandsUpdate } from './commands.update';
import { userCommands } from './user/user';

@Module({
  providers: [CommandsUpdate, ...userCommands],
})
export class CommandsModule { }
