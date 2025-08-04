#!/usr/bin/env node
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import * as cdk from 'aws-cdk-lib';

import { EventsStack } from '../lib/stacks/events-stack';
import { SubscriptionsStack } from '../lib/stacks/subscriptions-stack';
import { UsersStack } from '../lib/stacks/users-stack';

const app = new cdk.App();

const env = {
  account: process.env.AWS_ACCOUNT,
  region: process.env.AWS_REGION,
};

const usersStack = new UsersStack(app, 'UsersStack', { env });
const eventsStack = new EventsStack(app, 'EventsStack', { env });

new SubscriptionsStack(app, 'SubscriptionsStack', {
  env,
  usersTable: usersStack.usersTable,
  eventsTable: eventsStack.eventsTable,
});
