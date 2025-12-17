# Detailed Design - Lumina Learning Platform

## 1. System Architecture

### 1.1 Overview
The application is a **Hybrid Single Page Application (SPA)** built with **React 19**, **TypeScript**, and **Vite**. It employs a **Feature-Based Architecture** to manage complexity, organizing code by domain (AI, Art, Programming) rather than technical layer.

### 1.2 Technology Stack
*   **Frontend:** React 19, TypeScript, Vite.
*   **AI Engine:** Google Gemini API (Model Agnostic: 2.0 Flash, 3.0 Pro).
*   **State Management:** Local React State (`useState`) lifted to `App.tsx` for global navigation.
*   **Styling:** Tailwind CSS (via utility classes).
*   **Icons:** `lucide-react`.

## 2. Directory Structure (Feature-Based)
```
/src
  /components
    /common          # Shared UI (Layout, Buttons, Modals)
    /features
      /ai            # AI Generator, Chat, Concierge
      /art           # Art Museum curriculums
      /blender       # Blender curriculums
      /dashboard     # Dashboard, Profile, MyContent
      /programming   # Coding curriculums (Python, Web, Vibe)
      /sonic         # Sonic Pi / Synth
  /services          # API clients, Data fetchers
  /types             # TypeScript definitions
  App.tsx            # Main Controller & Router
```

## 3. Data Models (`types.ts`)

### 3.1 Big5 Profile
```typescript
export interface Big5Profile {
  openness: number;        // 0-100
  conscientiousness: number; // 0-100
  extraversion: number;    // 0-100
  agreeableness: number;   // 0-100
  neuroticism: number;     // 0-100
}
```

### 3.2 Generated Content
```typescript
export interface GeneratedChapter {
  id: string | number;
  title: string;
  duration: string;
  type: string;
  content: string;
  // Rich Educational Fields
  whyItMatters: string;
  keyConcepts: string[];
  actionStep: string;
  analogy: string;
}

export interface GeneratedCourse {
  id: string;
  title: string;
  description: string;
  // ...
  targetProfile?: Big5Profile;
}
```

## 4. Key Services (`geminiService.ts`)

### 4.1 Pedagogical Strategy Generation
The service includes a helper `generatePedagogicalStrategy(profile: Big5Profile)` that translates Big5 scores into specific prompting instructions:
*   **High Openness:** "Use metaphors, abstract concepts, connect dots."
*   **High Conscientiousness:** "Structure clearly, define outcomes, step-by-step."
*   **High Extraversion:** "Interactive, social context, energetic tone."
*   **High Neuroticism:** "Warn of pitfalls, provide safe guides, reassuring tone."

### 4.2 Course Generation Flow
1.  **Input:** User Topic + Big5 Profile + Model Preference.
2.  **Strategy:** Generate system prompt based on Profile.
3.  **Retrieval (Simulated):** Search `_mockVectorStore` for relevant context (RAG).
4.  **Generation:** Call Gemini API (Standard/Pro) with strict JSON schema.
5.  **Output:** Return `GeneratedCourse` object.

## 5. UI/UX Design

### 5.1 Course Generator View
*   **Topic Input:** Text field.
*   **Model Toggle:** Standard vs. Pro (Gemini 3.0).
*   **Personalization:** Sliders for Big5 traits + Preset buttons (Artist, Scientist, etc.).

### 5.2 Generated Lesson View
*   **Dynamic Rendering:** Displays content specific to the generated course.
*   **Rich Layout:** Cards for "Why It Matters", "Analogy", "Key Concepts", "Action Step".
*   **Navigation:** Next/Prev chapter controls.
*   **AI Chat Sidebar:** Context-aware chat (toggleable).

## 6. Future Considerations
*   **Real Vector DB:** Replace `_mockVectorStore` with Pinecone or pgvector.
*   **User Persistence:** Save generated courses and profiles to a backend DB.
