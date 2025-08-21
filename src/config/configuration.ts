export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  globalPrefix: process.env.GLOBAL_PREFIX,
  appUrl: process.env.APP_URL,

  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    ses: {
      region: process.env.AWS_SES_REGION,
      fromEmail: process.env.AWS_SES_FROM_EMAIL,
    },
  },

  dynamodb: {
    endpoint: process.env.DYNAMO_ENDPOINT,
    usersTable: process.env.AWS_DYNAMODB_USERS_TABLE,
    eventsTable: process.env.AWS_DYNAMODB_EVENTS_TABLE,
    subscriptionsTable: process.env.AWS_DYNAMODB_SUBSCRIPTIONS_TABLE,
  },

  s3: {
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    usersFolderOriginals: process.env.AWS_S3_FOLDER_USERS_ORIGINALS,
    usersFolderResized: process.env.AWS_S3_FOLDER_USERS_RESIZED,
    eventsFolderOriginals: process.env.AWS_S3_FOLDER_EVENTS_ORIGINALS,
    eventsFolderResized: process.env.AWS_S3_FOLDER_EVENTS_RESIZED,
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
