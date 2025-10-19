import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // 環境変数の存在確認
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
    const secretKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
    const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;

    // 文字数と形式の確認
    const analysis = {
      accountId: {
        exists: !!accountId,
        length: accountId?.length || 0,
        firstChars: accountId?.substring(0, 8) || 'N/A',
        lastChars: accountId?.substring(-8) || 'N/A',
        hasNewlines: accountId?.includes('\n') || false,
        hasTabs: accountId?.includes('\t') || false,
        hasCarriageReturn: accountId?.includes('\r') || false
      },
      accessKeyId: {
        exists: !!accessKeyId,
        length: accessKeyId?.length || 0,
        firstChars: accessKeyId?.substring(0, 8) || 'N/A',
        lastChars: accessKeyId?.substring(-8) || 'N/A',
        hasNewlines: accessKeyId?.includes('\n') || false,
        hasTabs: accessKeyId?.includes('\t') || false,
        hasCarriageReturn: accessKeyId?.includes('\r') || false
      },
      secretKey: {
        exists: !!secretKey,
        length: secretKey?.length || 0,
        firstChars: secretKey?.substring(0, 8) || 'N/A',
        lastChars: secretKey?.substring(-8) || 'N/A',
        hasNewlines: secretKey?.includes('\n') || false,
        hasTabs: secretKey?.includes('\t') || false,
        hasCarriageReturn: secretKey?.includes('\r') || false
      },
      endpoint: {
        exists: !!endpoint,
        value: endpoint || 'N/A',
        hasNewlines: endpoint?.includes('\n') || false,
        hasTabs: endpoint?.includes('\t') || false,
        hasCarriageReturn: endpoint?.includes('\r') || false
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Environment variables analysis',
      analysis,
      summary: {
        allPresent: !!(accountId && accessKeyId && secretKey && endpoint),
        hasInvalidChars: Object.values(analysis).some(item => 
          'hasNewlines' in item && (item.hasNewlines || item.hasTabs || item.hasCarriageReturn)
        )
      }
    });

  } catch (error) {
    console.error('Environment analysis error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
