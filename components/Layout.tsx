import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import {
  LayoutDashboard,
  Layers, // For Learning Hub
  Map as MapIcon,
  Library as LibraryIcon,
  Sparkles,
  User,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Box,
  Terminal,
  Palette,
  Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const view = currentView.toString();
    if (view.startsWith('ART_')) {
      setTheme('art');
    } else if (
      (view.startsWith('VIBE_') && view !== 'VIBE_PATH') || // Keep Path light
      (view.startsWith('PROGRAMMING') && !view.includes('WEB')) || // WEB track is light
      view.startsWith('PYTHON_') ||
      view.startsWith('WEB_')
    ) {
      setTheme('vibe');
    } else {
      setTheme('default');
    }
  }, [currentView, setTheme]);

  const getThemeStyles = () => {
    switch (theme) {
      case 'art':
        return {
          sidebar: 'bg-[#1c1917] border-stone-800 text-stone-400',
          sidebarActive: 'bg-stone-800 text-stone-100',
          sidebarHover: 'hover:bg-stone-800 hover:text-stone-200',
          main: 'bg-[#1c1917]',
          text: 'text-stone-400',
          mobileHeader: 'bg-[#1c1917] border-stone-800 text-stone-100'
        };
      case 'vibe':
        return {
          sidebar: 'bg-black border-white/10 text-slate-400',
          sidebarActive: 'bg-white/10 text-white',
          sidebarHover: 'hover:bg-white/5 hover:text-white',
          main: 'bg-black',
          text: 'text-slate-400',
          mobileHeader: 'bg-black border-white/10 text-white'
        };
      default:
        return {
          sidebar: 'bg-white border-slate-200',
          sidebarActive: 'bg-indigo-50 text-indigo-700',
          sidebarHover: 'hover:bg-slate-50 hover:text-slate-900',
          main: 'bg-slate-50',
          text: 'text-slate-600',
          mobileHeader: 'bg-white border-slate-200 text-slate-800'
        };
    }
  };

  const styles = getThemeStyles();

  const navItems = [
    { view: ViewState.DASHBOARD, label: 'ダッシュボード', icon: LayoutDashboard },
    { view: ViewState.LEARNING_HUB, label: '学習コンテンツ', icon: Layers }, // Unified Hub
    // { view: ViewState.LIBRARY, label: 'ライブラリ', icon: LibraryIcon },
    { view: ViewState.AI_TUTOR, label: 'AIチューター', icon: Sparkles },
    // { view: ViewState.PROFILE, label: 'Profile', icon: User },
  ];

  const isNavItemActive = (itemInfo: { view: ViewState }) => {
    if (currentView === ViewState.LESSON && itemInfo.view === ViewState.DASHBOARD) {
      return true;
    }
    if ((currentView === ViewState.SONIC_SYNTH) && itemInfo.view === ViewState.LEARNING_HUB) {
      return true;
    }
    // All specific curricuclums should verify active state for LEARNING_HUB
    if ((
      currentView === ViewState.BLENDER || currentView === ViewState.BLENDER_PATH || currentView === ViewState.BLENDER_LESSON ||
      currentView.toString().startsWith('VIBE') || currentView.toString().startsWith('PROGRAMMING') || currentView.toString().startsWith('PYTHON') ||
      currentView.toString().startsWith('ART') ||
      currentView === ViewState.SONIC_LAB
    ) && itemInfo.view === ViewState.LEARNING_HUB) {
      return true;
    }
    return currentView === itemInfo.view;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Header */}
      <div className={`md:hidden fixed w-full z-50 border-b px-4 py-3 flex justify-between items-center ${styles.mobileHeader}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <span className={`font-bold tracking-tight ${theme === 'default' ? 'text-slate-700' : 'text-white'} `}>Lumina</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:relative z-40 h-full border-r flex flex-col transition-all duration-300 ease-in-out
        ${styles.sidebar}
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        pt-16 md:pt-0 group/sidebar relative
      `}>
        {/* Toggle Button - Floating on Border */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            absolute -right-3 top-8 z-50
            w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center
            text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all
            hidden md:flex
          `}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        <div className={`p-4 hidden md:flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 h-16`}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md text-base shrink-0 transition-all">L</div>
          <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <span className={`text-lg font-bold tracking-tight whitespace-nowrap ${theme === 'default' ? 'text-slate-700' : 'text-white'}`}>Lumina</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = isNavItemActive(item);
            return (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  flex items-center rounded-lg transition-all duration-200 font-medium
                  ${isActive
                    ? styles.sidebarActive
                    : styles.sidebarHover
                  }
                  ${isCollapsed
                    ? 'justify-center w-10 h-10 mx-auto p-0'
                    : 'w-full gap-3 px-3 py-2.5'
                  }
                `}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon size={20} className={`shrink-0 ${isActive ? 'text-indigo-600' : styles.text}`} />
                <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
          {/* Sign Out - Unified */}
          <button
            className={`
              flex items-center rounded-lg transition-all duration-200 font-medium mt-auto
              ${styles.sidebarHover} ${styles.text}
              ${isCollapsed
                ? 'justify-center w-10 h-10 mx-auto p-0'
                : 'w-full gap-3 px-3 py-2.5'
              }
            `}
            title={isCollapsed ? "ログアウト" : ""}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              ログアウト
            </span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto h-full w-full pt-16 md:pt-0 relative ${styles.main}`}>
        <div className={`h-full ${currentView === ViewState.LESSON || currentView === ViewState.BLENDER_LESSON ? '' : 'max-w-7xl mx-auto'}`}>
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;