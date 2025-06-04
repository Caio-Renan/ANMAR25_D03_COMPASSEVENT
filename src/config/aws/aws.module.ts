import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoService } from 'src/common/aws/dynamo.service';
import { S3Service } from 'src/common/aws/s3.service';
import { SESService } from 'src/common/aws/ses.service';

import { DynamoProvider } from './dynamo.provider';
import { S3Provider } from './s3.provider';
import { SESProvider } from './ses.provider';

const awsProviders = [DynamoProvider, S3Provider, SESProvider];
const awsServices = [DynamoService, S3Service, SESService];

@Global()
@Module({
  imports: [ConfigModule],
  providers: [...awsProviders, ...awsServices],
  exports: [...awsProviders, ...awsServices],
})
export class AwsModule {}
