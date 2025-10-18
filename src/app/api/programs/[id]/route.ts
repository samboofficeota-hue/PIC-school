import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const programId = parseInt(params.id);
    
    if (isNaN(programId)) {
      return NextResponse.json({ error: 'Invalid program ID' }, { status: 400 });
    }

    // プログラム詳細取得
    const { data, error } = await db.getProgram(programId);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
