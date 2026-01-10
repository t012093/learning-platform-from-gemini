import React from 'react';
import { ViewState } from '../../../types';
import VibeDocView from './VibeDocView';
import { UNITY_CHAPTER_3_DATA } from '../../../data/curricula/unity_ai/chapter3';

interface UnityChapterThreeViewProps {
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
  language: 'en' | 'jp';
  setLanguage: (lang: 'en' | 'jp') => void;
}

const UnityChapterThreeView: React.FC<UnityChapterThreeViewProps> = ({ onBack, onNavigate, language, setLanguage }) => {
  const chapterData = UNITY_CHAPTER_3_DATA[language];

  return (
    <VibeDocView 
      chapter={chapterData}
      onBack={onBack}
      onNavigate={onNavigate}
      language={language}
      setLanguage={setLanguage}
    />
  );
};

export default UnityChapterThreeView;
