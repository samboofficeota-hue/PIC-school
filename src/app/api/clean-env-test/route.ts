import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

export async function GET() {
  try {
    console.log('=== Clean Environment Test Started ===');
    
    // 環境変数の取得とクリーンアップ
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
    const secretKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
    const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;

    if (!accountId || !accessKeyId || !secretKey || !endpoint) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables'
      });
    }

    // 環境変数のクリーンアップ
    const cleanString = (str: string) => {
      return str
        .replace(/^\uFEFF/, '') // BOMを削除
        .replace(/[\r\n\t]/g, '') // 改行、キャリッジリターン、タブを削除
        .replace(/[\u2000-\u200F\u2028\u2029\u202F\u205F\u3000]/g, ' ') // 特殊な空白文字を通常のスペースに
        .replace(/\s+/g, ' ') // 連続する空白を1つに
        .trim(); // 前後の空白を削除
    };

    const cleanedCredentials = {
      accountId: cleanString(accountId),
      accessKeyId: cleanString(accessKeyId),
      secretKey: cleanString(secretKey),
      endpoint: cleanString(endpoint)
    };

    console.log('Original vs Cleaned:');
    console.log('Account ID:', {
      original: `${accountId.substring(0, 8)}... (${accountId.length})`,
      cleaned: `${cleanedCredentials.accountId.substring(0, 8)}... (${cleanedCredentials.accountId.length})`
    });
    console.log('Access Key ID:', {
      original: `${accessKeyId.substring(0, 8)}... (${accessKeyId.length})`,
      cleaned: `${cleanedCredentials.accessKeyId.substring(0, 8)}... (${cleanedCredentials.accessKeyId.length})`
    });
    console.log('Secret Key:', {
      original: `${secretKey.substring(0, 8)}... (${secretKey.length})`,
      cleaned: `${cleanedCredentials.secretKey.substring(0, 8)}... (${cleanedCredentials.secretKey.length})`
    });

    // クリーンアップされた認証情報でR2クライアントを作成
    const r2Client = new S3Client({
      region: 'auto',
      endpoint: cleanedCredentials.endpoint,
      credentials: {
        accessKeyId: cleanedCredentials.accessKeyId,
        secretAccessKey: cleanedCredentials.secretKey,
      },
    });

    console.log('S3 client created with cleaned credentials');

    try {
      // バケット一覧を取得してテスト
      console.log('Testing with cleaned credentials...');
      const listBucketsCommand = new ListBucketsCommand({});
      const bucketsResult = await r2Client.send(listBucketsCommand);
      
      const availableBuckets = bucketsResult.Buckets || [];
      console.log('Available buckets:', availableBuckets.map(b => b.Name));

      return NextResponse.json({
        success: true,
        message: 'Clean credentials test successful',
        data: {
          buckets: availableBuckets.map(bucket => ({
            name: bucket.Name,
            creationDate: bucket.CreationDate
          })),
          bucketCount: availableBuckets.length,
          credentialsCleaned: {
            accountIdLength: cleanedCredentials.accountId.length,
            accessKeyIdLength: cleanedCredentials.accessKeyId.length,
            secretKeyLength: cleanedCredentials.secretKey.length,
            endpointLength: cleanedCredentials.endpoint.length
          }
        }
      });

    } catch (error) {
      console.error('Clean credentials test failed:', error);
      
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Even with cleaned credentials, the connection failed',
        cleanedCredentials: {
          accountIdLength: cleanedCredentials.accountId.length,
          accessKeyIdLength: cleanedCredentials.accessKeyId.length,
          secretKeyLength: cleanedCredentials.secretKey.length,
          endpointLength: cleanedCredentials.endpoint.length
        }
      });
    }

  } catch (error) {
    console.error('Clean environment test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
