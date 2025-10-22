'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LESSONS, SESSION_NAMES, type LessonId, type SessionNumber } from '@/types';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  BookOpen,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  MessageSquare,
  Newspaper,
  PenTool,
  Bot,
  ListChecks
} from 'lucide-react';

interface LessonData {
  id: LessonId;
  title: string;
  description: string;
  theme: string;
  order: number;
  sessions: number;
  students: number;
  completionRate: number;
  averageTime: string;
}

interface SessionData {
  id: string;
  lessonId: LessonId;
  sessionNumber: SessionNumber;
  title: string;
  description: string;
  type: 'introduction' | 'content' | 'work' | 'dialogue' | 'summary';
  duration: string;
  status: 'published' | 'draft';
  order: number;
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'sessions'>('lessons');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // 講座データ（LESSNから生成）
  const lessonsData: LessonData[] = LESSONS.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    theme: lesson.theme,
    order: lesson.order,
    sessions: 5,
    students: Math.floor(Math.random() * 500),
    completionRate: Math.floor(Math.random() * 40 + 60),
    averageTime: '約30分',
  }));

  // セッションデータ（サンプル）
  const sessionsData: SessionData[] = [
    {
      id: '1-1',
      lessonId: 1,
      sessionNumber: 1,
      title: SESSION_NAMES[1],
      description: '対話形式でテーマの核心に迫ります',
      type: 'introduction',
      duration: '5分',
      status: 'published',
      order: 1
    },
    {
      id: '1-2',
      lessonId: 1,
      sessionNumber: 2,
      title: SESSION_NAMES[2],
      description: 'ニュース事例から学びます',
      type: 'content',
      duration: '7分',
      status: 'published',
      order: 2
    },
    {
      id: '1-3',
      lessonId: 1,
      sessionNumber: 3,
      title: SESSION_NAMES[3],
      description: '実際に手を動かして学びます',
      type: 'work',
      duration: '10分',
      status: 'published',
      order: 3
    },
    {
      id: '1-4',
      lessonId: 1,
      sessionNumber: 4,
      title: SESSION_NAMES[4],
      description: 'AI対話で考えを深めます',
      type: 'dialogue',
      duration: '5分',
      status: 'draft',
      order: 4
    },
    {
      id: '1-5',
      lessonId: 1,
      sessionNumber: 5,
      title: SESSION_NAMES[5],
      description: '要点を整理します',
      type: 'summary',
      duration: '3分',
      status: 'published',
      order: 5
    },
  ];

  const filteredLessons = lessonsData.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.theme.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />公開中</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />下書き</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />アーカイブ</Badge>;
      default:
        return null;
    }
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'introduction':
        return <MessageSquare className="w-4 h-4" />;
      case 'content':
        return <Newspaper className="w-4 h-4" />;
      case 'work':
        return <PenTool className="w-4 h-4" />;
      case 'dialogue':
        return <Bot className="w-4 h-4" />;
      case 'summary':
        return <ListChecks className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getSessionTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      introduction: 'bg-blue-100 text-blue-800',
      content: 'bg-green-100 text-green-800',
      work: 'bg-orange-100 text-orange-800',
      dialogue: 'bg-purple-100 text-purple-800',
      summary: 'bg-pink-100 text-pink-800',
    };
    
    const labels: Record<string, string> = {
      introduction: 'イントロ',
      content: 'コンテンツ',
      work: 'ワーク',
      dialogue: '対話',
      summary: 'サマリー',
    };

    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {getSessionIcon(type)}
        <span className="ml-1">{labels[type] || type}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">コンテンツ管理</h1>
          <p className="text-gray-600 mt-2">講座とSessionの管理を行えます（公益資本主義アカデミー - 全10講座固定）</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            設定
          </Button>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            コンテンツを編集
          </Button>
        </div>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">総講座数</div>
          <div className="text-2xl font-bold">10講座</div>
          <div className="text-xs text-gray-500 mt-1">固定（公益資本主義アカデミー）</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">総Session数</div>
          <div className="text-2xl font-bold">50</div>
          <div className="text-xs text-gray-500 mt-1">各講座5Session</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">公開中</div>
          <div className="text-2xl font-bold text-green-600">10講座</div>
          <div className="text-xs text-gray-500 mt-1">すべて公開済み</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">総受講者</div>
          <div className="text-2xl font-bold">1,234名</div>
          <div className="text-xs text-gray-500 mt-1">全講座合計</div>
        </Card>
      </div>

      {/* タブ */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'lessons'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            講座 ({lessonsData.length})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sessions'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Session ({sessionsData.length}件表示)
          </button>
        </nav>
      </div>

      {/* 検索・フィルター */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={activeTab === 'lessons' ? '講座名またはテーマで検索...' : 'Session名で検索...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              フィルター
            </Button>
          </div>
        </div>
      </Card>

      {/* 講座一覧 */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-primary to-secondary p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl font-bold">{lesson.id}</div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    公開中
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold">{lesson.title}</h3>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {lesson.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">テーマ</span>
                    <Badge variant="outline">{lesson.theme}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Session数</span>
                    <span>{lesson.sessions}個</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">受講者数</span>
                    <span>{lesson.students.toLocaleString()}人</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">完了率</span>
                    <span className="font-semibold text-green-600">{lesson.completionRate}%</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    編集
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Session一覧 */}
      {activeTab === 'sessions' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    講座
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タイプ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    順序
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    時間
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessionsData.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{session.title}</div>
                        <div className="text-sm text-gray-500">{session.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        第{session.lessonId}回
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getSessionTypeBadge(session.type)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(session.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{session.order}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {session.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ヘルプカード */}
      <Card className="p-6 bg-blue-50">
        <h3 className="text-lg font-semibold mb-2">📌 コンテンツ管理について</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 公益資本主義アカデミーは全10講座の固定カリキュラムです</li>
          <li>• 各講座は5つのSession（イントロ、コンテンツ、ワーク、対話、サマリー）で構成されています</li>
          <li>• 講座の追加・削除はできませんが、各Sessionのコンテンツを編集できます</li>
        </ul>
      </Card>
    </div>
  );
}
