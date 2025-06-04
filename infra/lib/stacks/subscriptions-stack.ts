import * as cdk from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib';
import { AttributeType, BillingMode, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import type { Construct } from 'constructs';

export class SubscriptionsStack extends cdk.Stack {
  public readonly subscriptionsTable: Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.subscriptionsTable = new Table(this, 'SubscriptionsTable', {
      tableName: 'Subscriptions',
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.subscriptionsTable.addGlobalSecondaryIndex({
      indexName: 'userId-id-index',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'id', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.subscriptionsTable.addGlobalSecondaryIndex({
      indexName: 'eventId-id-index',
      partitionKey: { name: 'eventId', type: AttributeType.STRING },
      sortKey: { name: 'id', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.subscriptionsTable.addGlobalSecondaryIndex({
      indexName: 'status-createdAt-index',
      partitionKey: { name: 'status', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.subscriptionsTable.addGlobalSecondaryIndex({
      indexName: 'user-event-index',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'eventId', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    Tags.of(this.subscriptionsTable).add('Project', 'CompassEvent');
    Tags.of(this.subscriptionsTable).add('Environment', 'dev');
    Tags.of(this.subscriptionsTable).add('ManagedBy', 'CDK');
  }
}
