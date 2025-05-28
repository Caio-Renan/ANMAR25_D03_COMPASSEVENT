#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { UsersStack } from '../lib/users-stack';
import { EventsStack } from '../lib/events-stack';
import { SubscriptionsStack } from '../lib/subscriptions-stack';

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
