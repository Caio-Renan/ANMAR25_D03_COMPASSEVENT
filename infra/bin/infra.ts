#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { UsersStack } from '../lib/stacks/users-stack';
import { EventsStack } from '../lib/stacks/events-stack';
import { SubscriptionsStack } from '../lib/stacks/subscriptions-stack';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();

new UsersStack(app, 'UsersStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

new EventsStack(app, 'EventsStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

new SubscriptionsStack(app, 'SubscriptionsStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
