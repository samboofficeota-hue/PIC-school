import { NextRequest, NextResponse } from 'next/server';
import { S3Client, CreateBucketCommand } from '@aws-sdk/client-s3';

export async function POST() {
  try {
    console.log('=== R2 Bucket Creation Started ===');
    
    // 環境変数の取得
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

    // R2クライアントの作成
    const r2Client = new S3Client({
      region: 'auto',
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretKey,
      },
    });

    const bucketName = 'pic-school-media';
    
    try {
      console.log(`Creating bucket '${bucketName}'...`);
      
      const createBucketCommand = new CreateBucketCommand({
        Bucket: bucketName,
        // Cloudflare R2では特定のリージョン設定は不要
      });
      
      await r2Client.send(createBucketCommand);
      
      console.log(`Bucket '${bucketName}' created successfully`);
      
      return NextResponse.json({
        success: true,
        message: `Bucket '${bucketName}' created successfully`,
        data: {
          bucketName,
          accountId: accountId.substring(0, 8) + '...',
          endpoint
        }
      });

    } catch (error) {
      console.error('Bucket creation failed:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('BucketAlreadyExists')) {
          return NextResponse.json({
            success: true,
            message: `Bucket '${bucketName}' already exists`,
            data: { bucketName }
          });
        } else if (error.message.includes('AccessDenied')) {
          return NextResponse.json({
            success: false,
            error: 'Access denied - insufficient permissions to create bucket',
            suggestion: 'Check R2 API token permissions in Cloudflare dashboard'
          });
        } else {
          return NextResponse.json({
            success: false,
            error: error.message,
            suggestion: 'Check Cloudflare R2 settings and permissions'
          });
        }
      } else {
        return NextResponse.json({
          success: false,
          error: 'Unknown error occurred during bucket creation'
        });
      }
    }

  } catch (error) {
    console.error('R2 bucket creation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
