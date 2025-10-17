'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  Settings
} from 'lucide-react';

interface Program {
  id: string;
  title: string;
  description: string;
  status: 'published' | 'draft' | 'archived';
  price: number;
  isFree: boolean;
  chapters: number;
  duration: string;
  students: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

interface Chapter {
  id: string;
  programId: string;
  title: string;
  description: string;
  order: number;
  duration: string;
  status: 'published' | 'draft';
  type: 'content' | 'video' | 'test';
  isLocked: boolean;
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<'programs' | 'chapters'>('programs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // サンプルデータ（実際のアプリではAPIから取得）
  const programs: Program[] = [
    {
      id: '1',
      title: 'ビジネススキル基礎コース',
      description: 'ビジネスの基本原則から実践的なスキルまで、体系的に学べる総合コースです。',
      status: 'published',
      price: 0,
      isFree: true,
      chapters: 25,
      duration: '5時間30分',
      students: 1250,
      rating: 4.8,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-20',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'マーケティング戦略',
      description: '効果的なマーケティング戦略の立案と実行方法を学びます。',
      status: 'published',
      price: 29800,
      isFree: false,
      chapters: 15,
      duration: '3時間20分',
      students: 456,
      rating: 4.6,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-18',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'データ分析コース',
      description: 'データに基づいた意思決定を行うための分析手法を学びます。',
      status: 'draft',
      price: 39800,
      isFree: false,
      chapters: 20,
      duration: '4時間15分',
      students: 0,
      rating: 0,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-19',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '4',
      title: 'リーダーシップ開発',
      description: '効果的なリーダーシップスキルを身につけるためのコースです。',
      status: 'archived',
      price: 49800,
      isFree: false,
      chapters: 18,
      duration: '3時間45分',
      students: 234,
      rating: 4.4,
      createdAt: '2023-12-15',
      updatedAt: '2024-01-15',
      thumbnail: '/api/placeholder/300/200'
    }
  ];

  const chapters: Chapter[] = [
    {
      id: '1',
      programId: '1',
      title: 'ビジネスの基本原則',
      description: 'ビジネスの基本概念と原則について学びます。',
      order: 1,
      duration: '45分',
      status: 'published',
      type: 'content',
      isLocked: false
    },
    {
      id: '2',
      programId: '1',
      title: '市場分析と顧客理解',
      description: '市場の動向を分析し、顧客のニーズを理解する方法を学びます。',
      order: 2,
      duration: '60分',
      status: 'published',
      type: 'content',
      isLocked: true
    },
    {
      id: '3',
      programId: '1',
      title: '第1章のまとめとテスト',
      description: '第1章で学んだ内容をまとめ、理解度をテストします。',
      order: 5,
      duration: '30分',
      status: 'draft',
      type: 'test',
      isLocked: true
    }
  ];

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || program.status === filterStatus;
    return matchesSearch && matchesStatus;
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'content':
        return <Badge variant="outline">コンテンツ</Badge>;
      case 'video':
        return <Badge className="bg-blue-100 text-blue-800">動画</Badge>;
      case 'test':
        return <Badge className="bg-purple-100 text-purple-800">テスト</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">コンテンツ管理</h1>
          <p className="text-gray-600 mt-2">プログラムとチャプターの追加、変更、削除を行えます</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            設定
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            新しいコンテンツ
          </Button>
        </div>
      </div>

      {/* タブ */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('programs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'programs'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            プログラム ({programs.length})
          </button>
          <button
            onClick={() => setActiveTab('chapters')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'chapters'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            チャプター ({chapters.length})
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
                placeholder={activeTab === 'programs' ? 'プログラム名で検索...' : 'チャプター名で検索...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">すべてのステータス</option>
              <option value="published">公開中</option>
              <option value="draft">下書き</option>
              <option value="archived">アーカイブ</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              フィルター
            </Button>
          </div>
        </div>
      </Card>

      {/* プログラム一覧 */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {program.thumbnail && (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  {getStatusBadge(program.status)}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {program.title}
                  </h3>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {program.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">価格</span>
                    <span className="font-semibold">
                      {program.isFree ? '無料' : `¥${program.price.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">チャプター数</span>
                    <span>{program.chapters}章</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">受講者数</span>
                    <span>{program.students.toLocaleString()}人</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">評価</span>
                    <div className="flex items-center">
                      <span className="mr-1">★</span>
                      <span>{program.rating}</span>
                    </div>
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
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* チャプター一覧 */}
      {activeTab === 'chapters' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    チャプター
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    プログラム
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
                {chapters.map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{chapter.title}</div>
                        <div className="text-sm text-gray-500">{chapter.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {programs.find(p => p.id === chapter.programId)?.title || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getTypeBadge(chapter.type)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(chapter.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{chapter.order}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {chapter.duration}
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
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}
