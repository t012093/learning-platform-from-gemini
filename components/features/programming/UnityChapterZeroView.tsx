import React from 'react';
import { ViewState } from '../../../types';
import VibeDocView from './VibeDocView';
import { UNITY_CHAPTER_0_DATA } from '../../../data/curricula/unity_ai/chapter0';

interface UnityChapterZeroViewProps {
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
  language: 'en' | 'jp';
  setLanguage: (lang: 'en' | 'jp') => void;
}

const UnityChapterZeroView: React.FC<UnityChapterZeroViewProps> = ({ onBack, onNavigate, language, setLanguage }) => {
  return (
    <VibeDocView 
      chapter={UNITY_CHAPTER_0_DATA}
      onBack={onBack}
      onNavigate={onNavigate}
    />
  );
};

export default UnityChapterZeroView;
