export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,

  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3BucketName: process.env.AWS_S3_BUCKET_NAME,
    ses: {
      region: process.env.AWS_SES_REGION,
      fromEmail: process.env.AWS_SES_FROM_EMAIL,
    },
  },

  dynamodb: {
    endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
    usersTable: process.env.AWS_DYNAMODB_USERS_TABLE,
    eventsTable: process.env.AWS_DYNAMODB_EVENTS_TABLE,
    subscriptionsTable: process.env.AWS_DYNAMODB_SUBSCRIPTIONS_TABLE,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  admin: {
    name: process.env.DEFAULT_ADMIN_NAME,
    email: process.env.DEFAULT_ADMIN_EMAIL,
    password: process.env.DEFAULT_ADMIN_PASSWORD,
  },
});
