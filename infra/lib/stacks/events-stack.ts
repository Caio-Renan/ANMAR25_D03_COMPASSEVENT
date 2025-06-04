import * as cdk from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib';
import { AttributeType, BillingMode, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import type { Construct } from 'constructs';

export class EventsStack extends cdk.Stack {
  public readonly eventsTable: Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.eventsTable = new Table(this, 'EventsTable', {
      tableName: 'Events',
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.eventsTable.addGlobalSecondaryIndex({
      indexName: 'name-id-index',
      partitionKey: { name: 'name', type: AttributeType.STRING },
      sortKey: { name: 'id', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.eventsTable.addGlobalSecondaryIndex({
      indexName: 'status-date-index',
      partitionKey: { name: 'status', type: AttributeType.STRING },
      sortKey: { name: 'date', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    Tags.of(this.eventsTable).add('Project', 'CompassEvent');
    Tags.of(this.eventsTable).add('Environment', 'dev');
    Tags.of(this.eventsTable).add('ManagedBy', 'CDK');
  }
}
