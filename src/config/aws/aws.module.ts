import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoProvider } from './dynamo.provider';
import { S3Provider } from './s3.provider';
import { SESProvider } from './ses.provider';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DynamoProvider, S3Provider, SESProvider],
  exports: [DynamoProvider, S3Provider, SESProvider],
})
export class AwsModule {}
