import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DynamoService } from '../../../src/common/aws/dynamo.service';
import {
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { AWS_CLIENTS } from '../../../src/common/constants/aws.constants';
import { AwsErrorMessages } from 'src/common/constants/error-messages/aws-error-messages';

describe('DynamoService', () => {
  let service: DynamoService;
  let dynamoClientMock: { send: jest.Mock };
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    dynamoClientMock = { send: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamoService,
        {
          provide: AWS_CLIENTS.DYNAMO_DOCUMENT,
          useValue: dynamoClientMock,
        },
      ],
    }).compile();

    service = module.get<DynamoService>(DynamoService);

    loggerErrorSpy = jest.spyOn((service as any).logger, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get an item', async () => {
    dynamoClientMock.send.mockResolvedValue({ Item: { id: '123' } });

    const result = await service.get({ TableName: 'Test', Key: { id: '123' } });

    expect(dynamoClientMock.send).toHaveBeenCalledWith(expect.any(GetCommand));
    expect(result).toEqual({ id: '123' });
  });

  it('should put an item', async () => {
    dynamoClientMock.send.mockResolvedValue({});

    await service.put({ TableName: 'Test', Item: { id: '123' } });

    expect(dynamoClientMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
  });

  it('should query items', async () => {
    dynamoClientMock.send.mockResolvedValue({ Items: [{ id: '123' }] });

    const result = await service.query({
      TableName: 'Test',
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': '123' },
    });

    expect(dynamoClientMock.send).toHaveBeenCalledWith(expect.any(QueryCommand));
    expect(result).toEqual([{ id: '123' }]);
  });

  it('should delete an item', async () => {
    dynamoClientMock.send.mockResolvedValue({});

    await service.delete({ TableName: 'Test', Key: { id: '123' } });

    expect(dynamoClientMock.send).toHaveBeenCalledWith(expect.any(DeleteCommand));
  });

  it('should update an item', async () => {
    dynamoClientMock.send.mockResolvedValue({});

    await service.update({
      TableName: 'Test',
      Key: { id: '123' },
      UpdateExpression: 'SET name = :name',
      ExpressionAttributeValues: { ':name': 'Test' },
    });

    expect(dynamoClientMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
  });

  it('should log and throw error on get failure', async () => {
    const error = new Error('DynamoDB get error');
    dynamoClientMock.send.mockRejectedValue(error);

    await expect(service.get({ TableName: 'Test', Key: { id: '123' } })).rejects.toThrow(error);
    expect(loggerErrorSpy).toHaveBeenCalledWith(AwsErrorMessages.DYNAMO_DB.GET_ERROR, error);
  });

  it('should log and throw error on put failure', async () => {
    const error = new Error('DynamoDB put error');
    dynamoClientMock.send.mockRejectedValue(error);

    await expect(service.put({ TableName: 'Test', Item: { id: '123' } })).rejects.toThrow(error);
    expect(loggerErrorSpy).toHaveBeenCalledWith(AwsErrorMessages.DYNAMO_DB.PUT_ERROR, error);
  });

  it('should log and throw error on query failure', async () => {
    const error = new Error('DynamoDB query error');
    dynamoClientMock.send.mockRejectedValue(error);

    await expect(
      service.query({
        TableName: 'Test',
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: { ':id': '123' },
      }),
    ).rejects.toThrow(error);
    expect(loggerErrorSpy).toHaveBeenCalledWith(AwsErrorMessages.DYNAMO_DB.QUERY_ERROR, error);
  });

  it('should log and throw error on delete failure', async () => {
    const error = new Error('DynamoDB delete error');
    dynamoClientMock.send.mockRejectedValue(error);

    await expect(service.delete({ TableName: 'Test', Key: { id: '123' } })).rejects.toThrow(error);
    expect(loggerErrorSpy).toHaveBeenCalledWith(AwsErrorMessages.DYNAMO_DB.DELETE_ERROR, error);
  });

  it('should log and throw error on update failure', async () => {
    const error = new Error('DynamoDB update error');
    dynamoClientMock.send.mockRejectedValue(error);

    await expect(
      service.update({
        TableName: 'Test',
        Key: { id: '123' },
        UpdateExpression: 'SET name = :name',
        ExpressionAttributeValues: { ':name': 'Test' },
      }),
    ).rejects.toThrow(error);
    expect(loggerErrorSpy).toHaveBeenCalledWith(AwsErrorMessages.DYNAMO_DB.UPDATE_ERROR, error);
  });
});
