'use client';

export default function DebugEnv() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">環境変数デバッグ</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">NEXT_PUBLIC_SUPABASE_URL</h2>
            <p className="text-gray-600 break-all">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined'}
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">NEXT_PUBLIC_SUPABASE_ANON_KEY</h2>
            <p className="text-gray-600 break-all">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
                `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 
                'undefined'
              }
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">環境変数の存在チェック</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}
                </span>
                NEXT_PUBLIC_SUPABASE_URL
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 mr-2">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}
                </span>
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
