import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, RefreshCw, Wifi, WifiOff, AlertTriangle, Image as ImageIcon, Play } from 'lucide-react';

interface TeacherBotLiveViewProps {
  onBack: () => void;
}

interface SidecarEvent {
  event_id: string;
  event: string;
  timestamp: number;
  session_id: string;
  tour?: {
    title?: string;
    version?: string;
  };
  step?: {
    id?: string;
    index?: number;
    total?: number;
    title?: string;
    description?: string;
    instruction?: string;
    hint?: string;
    why?: string;
    image?: string;
    media?: { type?: string; path?: string } | null;
  };
  extra?: Record<string, unknown>;
  state?: {
    mode?: string;
    selected_objects?: string[];
    active_object?: string | null;
  };
}

interface SidecarState {
  session_id: string;
  last_event: SidecarEvent | null;
  events: SidecarEvent[];
  updated_at?: number | null;
}

const TeacherBotLiveView: React.FC<TeacherBotLiveViewProps> = ({ onBack }) => {
  const [baseUrl, setBaseUrl] = useState<string>(() => localStorage.getItem('teacherBotBaseUrl') || 'http://localhost:3006');
  const [sessionId, setSessionId] = useState<string>(() => localStorage.getItem('teacherBotSessionId') || '');
  const [state, setState] = useState<SidecarState | null>(null);
  const [error, setError] = useState<string>('');
  const [isPolling, setIsPolling] = useState<boolean>(true);

  const lastEvent = state?.last_event || null;
  const step = lastEvent?.step || null;
  const events = state?.events || [];

  const resolvedMedia = useMemo(() => {
    if (!step) return null;
    const mediaType = step.media?.type?.toUpperCase();
    const mediaPath = step.media?.path || step.image || '';
    if (mediaPath) {
      return { type: mediaType || 'IMAGE', url: mediaPath.startsWith('http') ? mediaPath : `/teacher-bot/media/${mediaPath}` };
    }
    return null;
  }, [step]);

  const fetchState = async () => {
    if (!baseUrl) return;
    const url = new URL('/api/teacher-bot/state', baseUrl);
    if (sessionId) {
      url.searchParams.set('session_id', sessionId);
    }
    try {
      const res = await fetch(url.toString());
      const data = await res.json();
      if (!data.ok) {
        setError(data.message || 'No events yet');
        setState(null);
        return;
      }
      setError('');
      setState({
        session_id: data.session_id,
        last_event: data.last_event,
        events: data.events || [],
        updated_at: data.updated_at,
      });
      if (data.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
      }
    } catch (err) {
      setError('接続できませんでした');
    }
  };

  useEffect(() => {
    localStorage.setItem('teacherBotBaseUrl', baseUrl);
  }, [baseUrl]);

  useEffect(() => {
    localStorage.setItem('teacherBotSessionId', sessionId);
  }, [sessionId]);

  useEffect(() => {
    if (!isPolling) return undefined;
    fetchState();
    const interval = window.setInterval(fetchState, 2000);
    return () => window.clearInterval(interval);
  }, [baseUrl, sessionId, isPolling]);

  const progressText = step?.total ? `${step.index || 0}/${step.total}` : '-';

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPolling((prev) => !prev)}
                className="text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-slate-200 bg-white"
              >
                {isPolling ? 'Auto' : 'Paused'}
              </button>
              <button
                onClick={fetchState}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-slate-900 text-white"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400">Teacher Bot Live</div>
                  <h2 className="text-2xl font-bold text-slate-800">{step?.title || 'Waiting for events'}</h2>
                </div>
                <div className="text-sm text-slate-500">Progress {progressText}</div>
              </div>

              <div className="relative bg-slate-100 rounded-2xl overflow-hidden min-h-[320px] flex items-center justify-center">
                {resolvedMedia ? (
                  resolvedMedia.type === 'VIDEO' || resolvedMedia.type === 'MOVIE' ? (
                    <video src={resolvedMedia.url} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={resolvedMedia.url} alt="Lesson media" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="text-center text-slate-400">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-sm mb-4">
                      <ImageIcon size={24} />
                    </div>
                    <p className="text-sm">No media yet</p>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Instruction</div>
                  <p className="text-sm text-slate-600">{step?.instruction || 'Waiting for step instruction'}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Why</div>
                  <p className="text-sm text-slate-600">{step?.why || '—'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider text-slate-400">Connection</div>
                <div className="flex items-center gap-2 text-sm">
                  {error ? <WifiOff size={16} className="text-red-500" /> : <Wifi size={16} className="text-green-500" />}
                  <span className={error ? 'text-red-600' : 'text-slate-600'}>{error || 'Connected'}</span>
                </div>
                <div className="text-xs text-slate-400">Session: {state?.session_id || sessionId || 'auto'}</div>
              </div>

              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider text-slate-400">Control</div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Base URL</label>
                  <input
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg"
                  />
                  <label className="text-xs text-slate-400">Session ID</label>
                  <input
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider text-slate-400">Latest Event</div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600">
                  {lastEvent ? (
                    <div className="space-y-2">
                      <div className="font-semibold text-slate-800">{lastEvent.event}</div>
                      <div className="text-xs text-slate-400">{new Date(lastEvent.timestamp * 1000).toLocaleString()}</div>
                      <div className="text-xs text-slate-500">Mode: {lastEvent.state?.mode || '-'}</div>
                      <div className="text-xs text-slate-500">Selected: {(lastEvent.state?.selected_objects || []).join(', ') || '-'}</div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400">
                      <AlertTriangle size={14} /> Waiting for events
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider text-slate-400">Event Timeline</div>
                <div className="space-y-2 max-h-48 overflow-auto pr-1">
                  {events.slice(-6).reverse().map((evt) => (
                    <div key={evt.event_id} className="text-xs text-slate-500 flex items-center gap-2">
                      <Play size={12} className="text-indigo-400" />
                      <span className="font-semibold text-slate-700">{evt.event}</span>
                      <span className="text-slate-400">{evt.step?.id || '-'}</span>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <div className="text-xs text-slate-400">No events yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherBotLiveView;
