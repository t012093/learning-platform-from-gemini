// supabase.js - Supabase設定ファイル
import { createClient } from '@supabase/supabase-js'

// 環境変数からSupabaseプロジェクトの設定を読み込み
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance;

// 環境変数の存在確認とクライアント作成
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabaseの環境変数が設定されていません。.envファイルを確認してください。')
  console.error('必要な環境変数: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY')
  console.warn('⚠️ フォールバックとしてモッククライアントを使用します。DB機能は動作しません。');
  
  // モッククライアントの作成
  supabaseInstance = {
    auth: {
      getUser: async () => {
        console.warn('Mock Supabase: getUser called');
        return { data: { user: null }, error: null };
      },
      signInWithPassword: async () => {
         console.warn('Mock Supabase: signInWithPassword called');
         return { data: { user: null }, error: { message: "Mock client: Missing credentials" } };
      },
      signUp: async () => {
          console.warn('Mock Supabase: signUp called');
          return { data: { user: null }, error: { message: "Mock client: Missing credentials" } };
      },
      signOut: async () => {
          console.warn('Mock Supabase: signOut called');
          return { error: null };
      },
      onAuthStateChange: () => {
          return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    from: (table) => {
      console.warn(`Mock Supabase: from('${table}') called`);
      const mockQueryBuilder = {
        select: () => mockQueryBuilder,
        insert: () => mockQueryBuilder,
        update: () => mockQueryBuilder,
        delete: () => mockQueryBuilder,
        upsert: () => mockQueryBuilder,
        eq: () => mockQueryBuilder,
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        then: (resolve) => resolve({ data: [], error: null }) // Promise-like
      };
      return mockQueryBuilder;
    },
    channel: () => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => {}
    })
  };

} else {
  // Supabaseクライアントを作成
  try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
      console.log('Supabaseクライアント初期化完了 (環境変数から読み込み)')
      console.log('URL:', supabaseUrl ? '設定済み' : '未設定')
  } catch (e) {
      console.error('Supabaseクライアント作成エラー:', e);
      // エラー時もモックを返す（クラッシュ防止）
      supabaseInstance = {
          auth: { getUser: async () => ({ data: { user: null } }) },
          from: () => ({ select: () => ({ data: [] }) })
      };
  }
}

export const supabase = supabaseInstance;
