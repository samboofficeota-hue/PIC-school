import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('=== Environment Variables Fix Started ===');
    
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

    // 環境変数のクリーンアップ関数
    const cleanString = (str: string) => {
      return str
        .replace(/^\uFEFF/, '') // BOMを削除
        .replace(/[\r\n\t]/g, '') // 改行、キャリッジリターン、タブを削除
        .replace(/[\u2000-\u200F\u2028\u2029\u202F\u205F\u3000]/g, ' ') // 特殊な空白文字を通常のスペースに
        .replace(/\s+/g, ' ') // 連続する空白を1つに
        .trim(); // 前後の空白を削除
    };

    const cleaned = {
      accountId: cleanString(accountId),
      accessKeyId: cleanString(accessKeyId),
      secretKey: cleanString(secretKey),
      endpoint: cleanString(endpoint)
    };

    // 元の値とクリーンアップ後の値を比較
    const comparison = {
      accountId: {
        original: `${accountId.substring(0, 8)}... (${accountId.length})`,
        cleaned: `${cleaned.accountId.substring(0, 8)}... (${cleaned.accountId.length})`,
        changed: accountId !== cleaned.accountId
      },
      accessKeyId: {
        original: `${accessKeyId.substring(0, 8)}... (${accessKeyId.length})`,
        cleaned: `${cleaned.accessKeyId.substring(0, 8)}... (${cleaned.accessKeyId.length})`,
        changed: accessKeyId !== cleaned.accessKeyId
      },
      secretKey: {
        original: `${secretKey.substring(0, 8)}... (${secretKey.length})`,
        cleaned: `${cleaned.secretKey.substring(0, 8)}... (${cleaned.secretKey.length})`,
        changed: secretKey !== cleaned.secretKey
      },
      endpoint: {
        original: `${endpoint.substring(0, 20)}... (${endpoint.length})`,
        cleaned: `${cleaned.endpoint.substring(0, 20)}... (${cleaned.endpoint.length})`,
        changed: endpoint !== cleaned.endpoint
      }
    };

    console.log('Environment variables comparison:', comparison);

    return NextResponse.json({
      success: true,
      message: 'Environment variables analysis completed',
      comparison,
      cleanedValues: {
        CLOUDFLARE_ACCOUNT_ID: cleaned.accountId,
        CLOUDFLARE_ACCESS_KEY_ID: cleaned.accessKeyId,
        CLOUDFLARE_SECRET_ACCESS_KEY: cleaned.secretKey,
        CLOUDFLARE_R2_ENDPOINT: cleaned.endpoint
      },
      instructions: {
        title: 'Vercel環境変数の修正手順',
        steps: [
          '1. Vercelダッシュボードにアクセス',
          '2. プロジェクトの「Settings」→「Environment Variables」',
          '3. 各Cloudflare環境変数を削除',
          '4. 以下のクリーンアップされた値を再設定:',
          `   - CLOUDFLARE_ACCOUNT_ID: ${cleaned.accountId}`,
          `   - CLOUDFLARE_ACCESS_KEY_ID: ${cleaned.accessKeyId}`,
          `   - CLOUDFLARE_SECRET_ACCESS_KEY: ${cleaned.secretKey}`,
          `   - CLOUDFLARE_R2_ENDPOINT: ${cleaned.endpoint}`,
          '5. 保存後、再デプロイを実行'
        ]
      }
    });

  } catch (error) {
    console.error('Environment variables fix error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
