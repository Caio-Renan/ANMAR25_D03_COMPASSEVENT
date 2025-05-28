import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { Table, AttributeType, BillingMode, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';
import { Tags } from 'aws-cdk-lib';

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
      indexName: 'name-index',
      partitionKey: { name: 'name', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    Tags.of(this.eventsTable).add('Project', 'CompassEvent');
    Tags.of(this.eventsTable).add('Environment', 'dev');
    Tags.of(this.eventsTable).add('ManagedBy', 'CDK');
  }
}
