import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function GET() {
  try {
    // 環境変数の確認
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
    const secretKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
    const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;

    console.log('Environment variables check:', {
      accountId: accountId ? `${accountId.substring(0, 8)}...` : 'undefined',
      accessKeyId: accessKeyId ? `${accessKeyId.substring(0, 8)}...` : 'undefined',
      secretKey: secretKey ? `${secretKey.substring(0, 8)}...` : 'undefined',
      endpoint: endpoint ? endpoint : 'undefined'
    });

    if (!accountId || !accessKeyId || !secretKey || !endpoint) {
      return NextResponse.json({
        success: false,
        error: 'Missing Cloudflare environment variables',
        details: {
          accountId: !!accountId,
          accessKeyId: !!accessKeyId,
          secretKey: !!secretKey,
          endpoint: !!endpoint
        }
      });
    }

    // 認証情報の文字チェック
    const hasInvalidChars = (str: string) => {
      return /[\r\n\t]/.test(str);
    };

    if (hasInvalidChars(accessKeyId) || hasInvalidChars(secretKey)) {
      console.error('Invalid characters found in credentials');
      return NextResponse.json({
        success: false,
        error: 'Invalid characters in credentials',
        details: 'Credentials contain invalid characters (newlines, tabs, etc.)'
      });
    }

    // R2クライアントの作成
    const r2Client = new S3Client({
      region: 'auto',
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretKey,
      },
    });

    // バケットの内容をリストして接続をテスト
    const command = new ListObjectsV2Command({
      Bucket: 'pic-school-media',
      MaxKeys: 1
    });

    const result = await r2Client.send(command);

    return NextResponse.json({
      success: true,
      message: 'Cloudflare R2 connection successful',
      bucket: 'pic-school-media',
      objectCount: result.KeyCount || 0,
      endpoint: endpoint,
      accountId: accountId
    });

  } catch (error) {
    console.error('R2 connection error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check server logs for more information'
    });
  }
}




