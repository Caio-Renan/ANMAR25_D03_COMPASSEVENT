import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import Sharp from 'sharp';
import { Readable } from 'stream';

const BUCKET = process.env.S3_BUCKET_NAME!;
const REGION = process.env.AWS_REGION!;

interface ResizeVariant {
  width: number;
  height: number;
  folder: string;
}

interface ResizeConfig {
  originalFolder: string;
  variants: ResizeVariant[];
}

const RESIZE_CONFIG: ResizeConfig[] = [
  {
    originalFolder: process.env.S3_USERS_ORIGINALS_FOLDER!,
    variants: [{ width: 200, height: 200, folder: process.env.S3_USERS_RESIZED_FOLDER! }],
  },
  {
    originalFolder: process.env.S3_EVENTS_ORIGINALS_FOLDER!,
    variants: [{ width: 500, height: 500, folder: process.env.S3_EVENTS_RESIZED_FOLDER! }],
  },
];

const s3 = new S3Client({ region: REGION });

interface S3EventRecord {
  s3: {
    bucket: { name: string };
    object: { key: string };
  };
}

interface S3Event {
  Records: S3EventRecord[];
}

export const handler = async (event: S3Event): Promise<void> => {
  console.log('📥 S3 Event received:', JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    console.log(`🔑 Processing key: ${key}`);

    const config = RESIZE_CONFIG.find(cfg => key.startsWith(cfg.originalFolder));

    if (!config) {
      console.warn(`⚠️ No matching resize config for key: ${key}`);
      continue;
    }

    try {
      console.log(`⬇️ Downloading original image from S3: ${key}`);
      const originalObject = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
      const buffer = await streamToBuffer(originalObject.Body as Readable);

      if (!buffer || buffer.length < 10) {
        console.warn(`⚠️ Skipping ${key}: file is too small or empty`);
        continue;
      }

      try {
        await Sharp(buffer).metadata();
      } catch {
        console.warn(`⚠️ Skipping ${key}: invalid image file`);
        continue;
      }

      const filename = key.split('/').pop();
      if (!filename) throw new Error('Filename could not be determined');

      for (const variant of config.variants) {
        console.log(`🛠 Resizing to ${variant.width}x${variant.height}...`);
        const resizedBuffer = await Sharp(buffer)
          .resize(variant.width, variant.height, { fit: 'cover' })
          .toBuffer();

        const resizedKey = `${variant.folder}/${filename}`;
        console.log(`⬆️ Uploading resized image to S3: ${resizedKey}`);

        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: resizedKey,
            Body: resizedBuffer,
            ContentType: originalObject.ContentType,
          }),
        );

        console.log(`✅ Resized image uploaded: ${resizedKey}`);
      }
    } catch (error) {
      console.error(`❌ Error processing image ${key}:`, error);
    }
  }
};

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
