import * as cdk from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib';
import { AttributeType, BillingMode, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import type { Construct } from 'constructs';

export class UsersStack extends cdk.Stack {
  public readonly usersTable: Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.usersTable = new Table(this, 'UsersTable', {
      tableName: 'Users',
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'email-index',
      partitionKey: { name: 'email', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'role-id-index',
      partitionKey: { name: 'role', type: AttributeType.STRING },
      sortKey: { name: 'id', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'status-id-index',
      partitionKey: { name: 'status', type: AttributeType.STRING },
      sortKey: { name: 'id', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    Tags.of(this.usersTable).add('Project', 'CompassEvent');
    Tags.of(this.usersTable).add('Environment', 'dev');
    Tags.of(this.usersTable).add('ManagedBy', 'CDK');
  }
}
