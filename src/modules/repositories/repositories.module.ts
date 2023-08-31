import { Module } from '@nestjs/common';
import { StepRepository } from './step.repository';

@Module({
  providers: [StepRepository],
  exports: [StepRepository],
})
export class RepositoriesModule {}
