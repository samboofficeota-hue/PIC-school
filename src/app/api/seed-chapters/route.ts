import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    
    // チャプターデータの挿入
    const chapters = [
      // ビジネススキル基礎コース（ID: 4）のチャプター
      {
        program_id: 4,
        title: 'ビジネスの基本原則',
        description: 'ビジネスの基本概念と原則について学びます。',
        content: 'ビジネスとは、価値を創造し、それを顧客に提供することで利益を生み出す活動です。この章では、ビジネスの基本原則について詳しく学んでいきます。',
        video_url: 'https://example.com/video1.mp4',
        duration_minutes: 45,
        order_index: 1,
        is_free: true
      },
      {
        program_id: 4,
        title: '市場分析と顧客理解',
        description: '市場の動向を分析し、顧客のニーズを理解する方法を学びます。',
        content: '効果的なビジネス戦略を立てるためには、市場の状況を正確に把握し、顧客のニーズを深く理解する必要があります。',
        video_url: 'https://example.com/video2.mp4',
        duration_minutes: 60,
        order_index: 2,
        is_free: false
      },
      {
        program_id: 4,
        title: '戦略立案と計画',
        description: '効果的なビジネス戦略を立案し、実行計画を立てる方法を学びます。',
        content: '戦略立案は、ビジネスの成功を左右する重要なプロセスです。この章では、体系的に戦略を立案する方法を学びます。',
        video_url: 'https://example.com/video3.mp4',
        duration_minutes: 75,
        order_index: 3,
        is_free: false
      },
      {
        program_id: 4,
        title: '実行とオペレーション',
        description: '戦略を実行し、日常的なオペレーションを管理する方法を学びます。',
        content: '優れた戦略も実行されなければ意味がありません。この章では、戦略を効果的に実行する方法を学びます。',
        video_url: 'https://example.com/video4.mp4',
        duration_minutes: 80,
        order_index: 4,
        is_free: false
      },
      {
        program_id: 4,
        title: 'データ分析と意思決定',
        description: 'データに基づいた意思決定を行うための分析手法を学びます。',
        content: '現代のビジネスでは、データを活用した意思決定が不可欠です。この章では、データ分析の基本を学びます。',
        video_url: 'https://example.com/video5.mp4',
        duration_minutes: 70,
        order_index: 5,
        is_free: false
      }
    ];

    // 既存のチャプターデータを削除
    await supabase.from('chapters').delete().eq('program_id', 4);

    // 新しいチャプターデータを挿入
    const { data, error } = await supabase
      .from('chapters')
      .insert(chapters)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'チャプターデータが正常に作成されました',
      data: data
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
