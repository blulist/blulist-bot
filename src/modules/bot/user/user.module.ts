import { Module } from '@nestjs/common';
import { UserUpdate } from './user.update';

@Module({
  providers: [UserUpdate],
})
export class UserModule {}
