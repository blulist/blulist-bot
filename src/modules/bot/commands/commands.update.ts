import { Command, Ctx, Hears, Start, Update, Sender } from 'nestjs-telegraf';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
import { UpdateType } from '../shared/decorators/update-type.decorator';

@Update()
export class CommandsUpdate {
  @Start()
  onStart(@Sender('first_name') firstName: string): string {
    return `سلام خوش آومدید ${firstName}`;
  }

  @Hears(['hi', 'hello', 'hey', 'qq'])
  onGreetings(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
  ): string {
    return `Hey ${firstName}`;
  }
}
