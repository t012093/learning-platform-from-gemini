import React from 'react';
import { ViewState } from '../../../types';
import VibeDocView from './VibeDocView';
import { UNITY_CHAPTER_2_DATA } from '../../../data/curricula/unity_ai/chapter2';

interface UnityChapterTwoViewProps {
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
  language: 'en' | 'jp';
  setLanguage: (lang: 'en' | 'jp') => void;
}

const UnityChapterTwoView: React.FC<UnityChapterTwoViewProps> = ({ onBack, onNavigate, language, setLanguage }) => {
  const chapterData = UNITY_CHAPTER_2_DATA[language];

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

export default UnityChapterTwoView;
