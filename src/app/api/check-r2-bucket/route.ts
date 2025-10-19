import { NextRequest, NextResponse } from 'next/server';
import { S3Client, HeadBucketCommand, ListBucketsCommand } from '@aws-sdk/client-s3';

export async function GET() {
  try {
    console.log('=== R2 Bucket Check Started ===');
    
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

    const results = [];

    try {
      // 1. 利用可能なバケット一覧を取得
      console.log('Fetching available buckets...');
      const listBucketsCommand = new ListBucketsCommand({});
      const bucketsResult = await r2Client.send(listBucketsCommand);
      
      const availableBuckets = bucketsResult.Buckets || [];
      console.log('Available buckets:', availableBuckets.map(b => b.Name));
      
      results.push({
        test: 'List buckets',
        success: true,
        message: `Found ${availableBuckets.length} buckets`,
        data: {
          buckets: availableBuckets.map(bucket => ({
            name: bucket.Name,
            creationDate: bucket.CreationDate
          }))
        }
      });

      // 2. 特定のバケットの存在確認
      const targetBucket = 'pic-school-media';
      console.log(`Checking if bucket '${targetBucket}' exists...`);
      
      const headBucketCommand = new HeadBucketCommand({ Bucket: targetBucket });
      await r2Client.send(headBucketCommand);
      
      results.push({
        test: 'Target bucket exists',
        success: true,
        message: `Bucket '${targetBucket}' exists and is accessible`,
        data: { bucketName: targetBucket }
      });

    } catch (error) {
      console.error('Bucket check failed:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('NoSuchBucket')) {
          results.push({
            test: 'Target bucket exists',
            success: false,
            message: `Bucket 'pic-school-media' does not exist`,
            error: error.message,
            suggestion: 'The bucket needs to be created in Cloudflare R2 dashboard'
          });
        } else if (error.message.includes('AccessDenied')) {
          results.push({
            test: 'Target bucket access',
            success: false,
            message: 'Access denied to bucket',
            error: error.message,
            suggestion: 'Check R2 API token permissions'
          });
        } else if (error.message.includes('InvalidAccessKeyId')) {
          results.push({
            test: 'Authentication',
            success: false,
            message: 'Invalid access key ID',
            error: error.message,
            suggestion: 'Check CLOUDFLARE_ACCESS_KEY_ID environment variable'
          });
        } else if (error.message.includes('SignatureDoesNotMatch')) {
          results.push({
            test: 'Authentication',
            success: false,
            message: 'Invalid secret access key',
            error: error.message,
            suggestion: 'Check CLOUDFLARE_SECRET_ACCESS_KEY environment variable'
          });
        } else {
          results.push({
            test: 'Bucket check',
            success: false,
            message: 'Unknown error occurred',
            error: error.message
          });
        }
      } else {
        results.push({
          test: 'Bucket check',
          success: false,
          message: 'Unknown error occurred',
          error: 'Unknown error type'
        });
      }
    }

    const allTestsPassed = results.every(r => r.success);

    console.log('=== R2 Bucket Check Completed ===');
    console.log('All tests passed:', allTestsPassed);
    console.log('Results:', results);

    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'All bucket checks passed' : 'Some bucket checks failed',
      results,
      summary: {
        totalTests: results.length,
        passedTests: results.filter(r => r.success).length,
        failedTests: results.filter(r => !r.success).length
      }
    });

  } catch (error) {
    console.error('R2 bucket check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check server logs for more information'
    }, { status: 500 });
  }
}
