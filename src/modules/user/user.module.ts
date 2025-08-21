import { DynamoService } from '@aws/dynamo.service';
import { AwsModule } from '@config/aws/aws.module';
import { Module } from '@nestjs/common';
import { UserController } from '@user/controllers/user.controller';
import { UserRepository } from '@user/repositories/user.repository';
import { UserService } from '@user/services/user.service';

import { EmailModule } from '../mail/email.module';
@Module({
  imports: [AwsModule, EmailModule],
  controllers: [UserController],
  providers: [UserService, DynamoService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
