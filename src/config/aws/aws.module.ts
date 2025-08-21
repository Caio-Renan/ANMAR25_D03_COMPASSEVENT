import { DynamoService } from '@aws/dynamo.service';
import { S3Service } from '@aws/s3.service';
import { SESService } from '@aws/ses.service';
import { DynamoProvider } from '@config/aws/dynamo.provider';
import { S3Provider } from '@config/aws/s3.provider';
import { SESProvider } from '@config/aws/ses.provider';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

const awsProviders = [DynamoProvider, S3Provider, SESProvider];
const awsServices = [DynamoService, S3Service, SESService];

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule,
  ],
  providers: [...awsProviders, ...awsServices],
  exports: [...awsProviders, ...awsServices],
})
export class AwsModule {}
