import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2の設定
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = 'pic-school-media';

// ファイルアップロード
export async function uploadToR2(file: File, path: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
    Body: Buffer.from(buffer),
    ContentType: file.type,
  });

  await r2Client.send(command);
  
  // アップロードされたファイルのURLを返す
  return `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET_NAME}/${path}`;
}

// 署名付きURLの生成（プライベートファイル用）
export async function getSignedUrlForR2(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}

// ファイル削除
export async function deleteFromR2(path: string): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
  });

  await r2Client.send(command);
}
