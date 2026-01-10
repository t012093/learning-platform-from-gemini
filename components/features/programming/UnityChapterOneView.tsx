import React from 'react';
import { ViewState } from '../../../types';
import VibeDocView from './VibeDocView';
import { UNITY_CHAPTER_1_DATA } from '../../../data/curricula/unity_ai/chapter1';

interface UnityChapterOneViewProps {
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
  language: 'en' | 'jp';
  setLanguage: (lang: 'en' | 'jp') => void;
}

const UnityChapterOneView: React.FC<UnityChapterOneViewProps> = ({ onBack, onNavigate, language, setLanguage }) => {
  return (
    <VibeDocView 
      chapter={UNITY_CHAPTER_1_DATA}
      onBack={onBack}
      onNavigate={onNavigate}
    />
  );
};

export default UnityChapterOneView;
