import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { config as loadEnv } from 'dotenv';

import { AppModule } from '../src/app.module';
import { DynamoService } from '../src/common/aws/dynamo.service';

loadEnv();

const logger = new Logger('Seed');

const USERS_TABLE = process.env.DYNAMODB_TABLE_USERS!;
const EMAIL_INDEX = 'email-index';

async function userExists(dynamoService: DynamoService, email: string): Promise<boolean> {
  const result = await dynamoService.query({
    TableName: USERS_TABLE,
    IndexName: EMAIL_INDEX,
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
    Limit: 1,
  });

  return result.Items.length > 0;
}

async function createUser(
  dynamoService: DynamoService,
  user: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  },
) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const now = new Date().toISOString();

  const item = {
    pk: `USER#${user.email}`,
    sk: 'PROFILE',
    name: user.name,
    email: user.email,
    password: hashedPassword,
    phone: user.phone,
    role: user.role,
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };

  await dynamoService.put({
    TableName: USERS_TABLE,
    Item: item,
    ConditionExpression: 'attribute_not_exists(pk)',
  });

  logger.log(`User ${user.email} created`);
}

async function main() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  try {
    const dynamoService = appContext.get(DynamoService);

    const defaultUser = {
      name: process.env.DEFAULT_USER_NAME!,
      email: process.env.DEFAULT_USER_EMAIL!,
      password: process.env.DEFAULT_USER_PASSWORD!,
      phone: process.env.DEFAULT_USER_PHONE!,
      role: process.env.DEFAULT_USER_ROLE || 'ADMIN',
    };

    const exists = await userExists(dynamoService, defaultUser.email);

    if (exists) {
      logger.log(`Default user ${defaultUser.email} already exists`);
    } else {
      await createUser(dynamoService, defaultUser);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Seed failed: ${error.message}\n${error.stack}`);
    } else {
      logger.error(`Seed failed: ${JSON.stringify(error)}`);
    }
    process.exit(1);
  }
}

main();
