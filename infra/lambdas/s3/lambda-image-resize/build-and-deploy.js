const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { LambdaClient, UpdateFunctionCodeCommand } = require('@aws-sdk/client-lambda');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const ROOT = path.resolve(__dirname);
const DIST = path.join(ROOT, 'dist');
const ZIP_PATH = path.join(ROOT, 'lambda.zip');

const LAMBDA_FUNCTION_NAME = process.env.LAMBDA_FUNCTION_NAME;
const REGION = process.env.AWS_REGION;

if (!LAMBDA_FUNCTION_NAME) {
  console.error('❌ LAMBDA_FUNCTION_NAME is empty!');
  process.exit(1);
}
if (!REGION) {
  console.error('❌ AWS_REGION is empty!');
  process.exit(1);
}

(async () => {
  try {
    console.log('🚀 Building TypeScript...');
    execSync('tsc', { stdio: 'inherit' });

    console.log('📦 Creating Lambda ZIP...');
    if (fs.existsSync(ZIP_PATH)) fs.unlinkSync(ZIP_PATH);

    const output = fs.createWriteStream(ZIP_PATH);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    archive.glob('*.js', { cwd: DIST });

    const PROD_NODE_MODULES = path.join(ROOT, 'node_modules');
    if (fs.existsSync(PROD_NODE_MODULES)) {
      archive.directory(PROD_NODE_MODULES, 'node_modules');
    }

    await new Promise((resolve, reject) => {
      output.on('close', () => {
        console.log(`✅ Lambda ZIP created (${archive.pointer()} bytes)`);
        resolve();
      });
      archive.on('error', reject);
      archive.finalize();
    });

    console.log('🚀 Deploying to AWS Lambda...');

    const zipBuffer = fs.readFileSync(ZIP_PATH);

    const lambda = new LambdaClient({ region: REGION });
    const command = new UpdateFunctionCodeCommand({
      FunctionName: LAMBDA_FUNCTION_NAME,
      ZipFile: zipBuffer,
    });

    await lambda.send(command);
    console.log(`🎉 Lambda ${LAMBDA_FUNCTION_NAME} updated successfully!`);
  } catch (error) {
    console.error('❌ Build or deploy failed:', error);
    process.exit(1);
  }
})();
