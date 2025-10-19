import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, HeadBucketCommand } from '@aws-sdk/client-s3';

export async function GET() {
  try {
    console.log('=== Detailed R2 Test Started ===');
    
    // 環境変数の取得
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
    const secretKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
    const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;

    console.log('Environment variables:', {
      accountId: accountId ? `${accountId.substring(0, 8)}...` : 'undefined',
      accessKeyId: accessKeyId ? `${accessKeyId.substring(0, 8)}...` : 'undefined',
      secretKey: secretKey ? `${secretKey.substring(0, 8)}...` : 'undefined',
      endpoint: endpoint || 'undefined'
    });

    // 環境変数の存在確認
    if (!accountId || !accessKeyId || !secretKey || !endpoint) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
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
        details: 'Credentials contain newlines, tabs, or carriage returns'
      });
    }

    console.log('Creating S3 client...');
    
    // R2クライアントの作成
    const r2Client = new S3Client({
      region: 'auto',
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretKey,
      },
    });

    console.log('S3 client created successfully');

    const bucketName = 'pic-school-media';
    const results = [];

    try {
      // 1. バケットの存在確認
      console.log('Testing bucket existence...');
      const headCommand = new HeadBucketCommand({ Bucket: bucketName });
      await r2Client.send(headCommand);
      results.push({ test: 'Bucket existence', success: true, message: 'Bucket exists' });
      console.log('Bucket exists check passed');
    } catch (error) {
      console.error('Bucket existence check failed:', error);
      results.push({ 
        test: 'Bucket existence', 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }

    try {
      // 2. バケットの内容リスト
      console.log('Testing bucket listing...');
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        MaxKeys: 5
      });
      const listResult = await r2Client.send(listCommand);
      results.push({ 
        test: 'Bucket listing', 
        success: true, 
        message: `Found ${listResult.KeyCount || 0} objects`,
        data: {
          objectCount: listResult.KeyCount || 0,
          objects: listResult.Contents?.map(obj => ({
            key: obj.Key,
            size: obj.Size,
            lastModified: obj.LastModified
          })) || []
        }
      });
      console.log('Bucket listing check passed');
    } catch (error) {
      console.error('Bucket listing check failed:', error);
      results.push({ 
        test: 'Bucket listing', 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }

    const allTestsPassed = results.every(r => r.success);

    console.log('=== Detailed R2 Test Completed ===');
    console.log('All tests passed:', allTestsPassed);
    console.log('Results:', results);

    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'All R2 tests passed' : 'Some R2 tests failed',
      results,
      summary: {
        totalTests: results.length,
        passedTests: results.filter(r => r.success).length,
        failedTests: results.filter(r => !r.success).length
      }
    });

  } catch (error) {
    console.error('Detailed R2 test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check server logs for more information'
    }, { status: 500 });
  }
}
