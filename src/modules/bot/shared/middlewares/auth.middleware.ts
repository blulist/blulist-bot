import { Context } from '../interfaces/context.interface';
import { PrismaClient } from '@prisma/client';
export async function AuthMiddleware(ctx: Context, next: any) {
  const client = new PrismaClient();
  // const user = await client.user.findUnique({
  //   where: { userId: ctx.from.id },
  // });
  // if (!user)
  //   await client.user.create({
  //     data: {
  //       userId: ctx.from.id,
  //     },
  //   });

  next();
}
