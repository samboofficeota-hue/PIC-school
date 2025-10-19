import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== Deep Environment Analysis Started ===');
    
    // 環境変数の取得
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
    const secretKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
    const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;

    const analyzeString = (str: string, name: string) => {
      const analysis = {
        name,
        length: str.length,
        hasNewlines: str.includes('\n'),
        hasCarriageReturns: str.includes('\r'),
        hasTabs: str.includes('\t'),
        hasBOM: str.charCodeAt(0) === 0xFEFF,
        hasZeroWidthSpace: str.includes('\u200B'),
        hasNonBreakingSpace: str.includes('\u00A0'),
        hasFullWidthSpace: str.includes('\u3000'),
        hasOtherWhitespace: /[\u2000-\u200F\u2028\u2029\u202F\u205F\u3000]/.test(str),
        hasControlChars: /[\x00-\x1F\x7F-\x9F]/.test(str),
        hasUnicodeChars: /[^\x00-\x7F]/.test(str),
        firstCharCode: str.charCodeAt(0),
        lastCharCode: str.charCodeAt(str.length - 1),
        charCodes: Array.from(str).slice(0, 20).map(char => char.charCodeAt(0)),
        hexDump: Array.from(str).slice(0, 20).map(char => 
          char.charCodeAt(0).toString(16).padStart(4, '0')
        ).join(' '),
        cleaned: str.trim().replace(/[\r\n\t]/g, ''),
        cleanedLength: str.trim().replace(/[\r\n\t]/g, '').length
      };

      return analysis;
    };

    const results = {
      accountId: accountId ? analyzeString(accountId, 'CLOUDFLARE_ACCOUNT_ID') : null,
      accessKeyId: accessKeyId ? analyzeString(accessKeyId, 'CLOUDFLARE_ACCESS_KEY_ID') : null,
      secretKey: secretKey ? analyzeString(secretKey, 'CLOUDFLARE_SECRET_ACCESS_KEY') : null,
      endpoint: endpoint ? analyzeString(endpoint, 'CLOUDFLARE_R2_ENDPOINT') : null
    };

    // 問題のある文字を検出
    const issues = [];
    Object.values(results).forEach(analysis => {
      if (analysis) {
        if (analysis.hasNewlines) issues.push(`${analysis.name}: Contains newlines`);
        if (analysis.hasCarriageReturns) issues.push(`${analysis.name}: Contains carriage returns`);
        if (analysis.hasTabs) issues.push(`${analysis.name}: Contains tabs`);
        if (analysis.hasBOM) issues.push(`${analysis.name}: Contains BOM`);
        if (analysis.hasZeroWidthSpace) issues.push(`${analysis.name}: Contains zero-width space`);
        if (analysis.hasNonBreakingSpace) issues.push(`${analysis.name}: Contains non-breaking space`);
        if (analysis.hasFullWidthSpace) issues.push(`${analysis.name}: Contains full-width space`);
        if (analysis.hasOtherWhitespace) issues.push(`${analysis.name}: Contains other whitespace characters`);
        if (analysis.hasControlChars) issues.push(`${analysis.name}: Contains control characters`);
        if (analysis.length !== analysis.cleanedLength) {
          issues.push(`${analysis.name}: Length mismatch after cleaning (${analysis.length} vs ${analysis.cleanedLength})`);
        }
      }
    });

    console.log('Deep analysis results:', results);
    console.log('Issues found:', issues);

    return NextResponse.json({
      success: true,
      message: 'Deep environment analysis completed',
      results,
      issues,
      summary: {
        totalVariables: Object.values(results).filter(v => v !== null).length,
        issuesFound: issues.length,
        hasProblems: issues.length > 0
      }
    });

  } catch (error) {
    console.error('Deep environment analysis error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
