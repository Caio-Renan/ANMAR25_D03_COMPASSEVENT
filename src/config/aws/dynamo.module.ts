import { Module } from '@nestjs/common';
import { DynamoProvider } from './dynamo.provider';

@Module({
  providers: [DynamoProvider],
  exports: [DynamoProvider],
})
export class DynamoModule {}
