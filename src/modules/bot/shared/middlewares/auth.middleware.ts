import { Context } from '../interfaces/context.interface';
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();
export async function AuthMiddleware(ctx: Context, next: any) {
  const user = await client.user.findUnique({
    where: { userId: ctx.from.id },
  });
  if (!user)
    await client.user.create({
      data: {
        userId: ctx.from.id,
      },
    });

  next();
}
