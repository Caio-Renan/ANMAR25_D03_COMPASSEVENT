import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { Table, AttributeType, BillingMode, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';
import { Tags } from 'aws-cdk-lib';

export class SubscriptionsStack extends cdk.Stack {
  public readonly subscriptionsTable: Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.subscriptionsTable = new Table(this, 'SubscriptionsTable', {
      tableName: 'Subscriptions',
      partitionKey: { name: 'eventId', type: AttributeType.STRING },
      sortKey: { name: 'userId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.subscriptionsTable.addGlobalSecondaryIndex({
      indexName: 'userId-index',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    Tags.of(this.subscriptionsTable).add('Project', 'CompassEvent');
    Tags.of(this.subscriptionsTable).add('Environment', 'dev');
    Tags.of(this.subscriptionsTable).add('ManagedBy', 'CDK');
  }
}
