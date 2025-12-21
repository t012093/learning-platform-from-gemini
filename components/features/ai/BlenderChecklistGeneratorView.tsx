import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ChecklistBlock } from '../../../types';
import { retrieveBlenderImages } from '../../../services/blenderImageRagService';
import ChecklistPage from './multi-format/blocks/ChecklistPage';

type ChecklistTaskSpec = {
  id: string;
  label: string;
  details: string;
  query: string;
  fallback: string;
  allowedPaths: string[];
  linkUrl?: string;
  staticImageUrl?: string;
  staticImageCaption?: string;
};

const BASE_TASKS: ChecklistTaskSpec[] = [
  {
    id: 't1',
    label: 'Blender公式サイトからダウンロード',
    details: '安定版を公式サイトから入手します。必要なら要件も確認してください。',
    query: 'download blender',
    fallback: 'Blender download page',
    allowedPaths: ['getting_started/installing'],
    linkUrl: 'https://www.blender.org/download/',
    staticImageUrl: '/data/curricula/blender/_static/blender-download-page.png',
    staticImageCaption: 'Blender download page'
  },
  {
    id: 't2',
    label: 'インストールを実行',
    details: 'Windows: x64/arm64を選択。Installer版は開始メニュー登録と関連付けあり。Zip版は解凍して実行(管理者不要)。macOS: Intel/Apple Siliconを選択し、.dmgを開いて Blender.app をApplicationsへドラッグ。初回起動は承認が必要。',
    query: 'install windows blender',
    fallback: 'Blender install wizard',
    allowedPaths: ['getting_started/installing/windows', 'getting_started/installing/macos']
  },
  {
    id: 't3',
    label: '言語設定を日本語に変更',
    details: 'Edit > Preferences > Interface > Language を日本語に。TranslateのInterface/Tooltips/New Dataを必要に応じてオン。',
    query: 'blender preferences interface',
    fallback: 'Blender language settings',
    allowedPaths: ['editors/preferences/interface', 'editors/preferences']
  }
];

const buildImageUrl = (imagePath: string) => {
  const cleaned = imagePath.replace(/^_images\//, '');
  return `/data/curricula/blender/_images/${cleaned}`;
};

const isAllowedPath = (filePath: string, allowed: string[]) =>
  allowed.some((segment) => filePath.includes(segment));

const BlenderChecklistGeneratorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [block, setBlock] = useState<ChecklistBlock | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const used = new Set<string>();
      const tasks = [];

      for (const task of BASE_TASKS) {
        if (task.staticImageUrl) {
          tasks.push({
            id: task.id,
            label: task.label,
            details: task.details,
            imageUrl: task.staticImageUrl,
            imageCaption: task.staticImageCaption || '',
            linkUrl: task.linkUrl
          });
          continue;
        }
        const candidates = await retrieveBlenderImages(task.query, 25);
        const picked = candidates.find(
          (candidate) =>
            !used.has(candidate.image) && isAllowedPath(candidate.file, task.allowedPaths)
        );
        if (picked) {
          used.add(picked.image);
          tasks.push({
            id: task.id,
            label: task.label,
            details: task.details,
            imageUrl: buildImageUrl(picked.image),
            imageCaption: picked.caption || picked.alt || '',
            linkUrl: task.linkUrl
          });
        } else {
          tasks.push({
            id: task.id,
            label: task.label,
            details: task.details,
            imageKeyword: task.fallback,
            linkUrl: task.linkUrl
          });
        }
      }

      setBlock({
        id: 'blender-install-checklist',
        type: 'checklist',
        title: 'Blenderの冒険を始める準備',
        tasks
      });
    } catch (err) {
      console.error(err);
      setError('画像生成に失敗しました。インデックスが読み込めるか確認してください。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-[0.2em]">
              <ImageIcon size={16} /> Image Checklist Demo
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-3">
              Checklist Generator (Blender)
            </h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              画像インデックスから候補を検索し、チェックリストUIに差し込むテストページです。
              画像表示には `/data/curricula/blender/_images` が必要です。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-60"
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-10">
          {block ? (
            <ChecklistPage block={block} />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              生成ボタンを押してチェックリストを作成してください。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlenderChecklistGeneratorView;
