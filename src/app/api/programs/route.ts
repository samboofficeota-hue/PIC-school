import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function GET() {
  try {
    // プログラム一覧取得
    const { data, error } = await db.getPrograms();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
