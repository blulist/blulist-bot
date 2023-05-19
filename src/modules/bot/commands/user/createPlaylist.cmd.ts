import { Ctx, Hears, Update } from "nestjs-telegraf";
import { Context } from "telegraf";

@Update()
export class CreatePlaylistCmd {
    @Hears(["➕ create playlist"])
    handler(
        @Ctx() ctx: Context,
    ) {
        ctx.reply("esm playlist ro ersaal konid: ")
    }
}