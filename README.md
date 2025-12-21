<div align="center">
<img width="1200" height="400" alt="Lumina Banner" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" style="border-radius: 20px;" />

# Lumina Learning Platform
### The Next-Gen Immersive Learning Experience
</div>

<br/>

**Lumina** is a modern, experimental learning platform designed to revolutionize how we learn engineering, creativity, and languages. Unlike traditional LMS, Lumina focuses on **"Vibe"**—the feeling of flow, immersion, and narrative-driven education.

## 🌟 Key Features

### 1. **AI-Powered Personalized Curriculums** ✨
Experience learning tailored just for you.
- **Big5 Personality Integration**: AI dynamically adapts curriculum content, tone, and learning style based on your Big5 personality traits.
- **Rich Content Generation**: Lessons go beyond summaries, providing 'Why It Matters', 'Key Concepts', 'Action Steps', and 'Analogies'.
- **Advanced AI Models**: Utilizing **Google Gemini 3.0 Pro** for deep reasoning and **Gemini 2.0 Flash** for high-speed generation.
- **RAG (Retrieval-Augmented Generation)**: Integrates with specific knowledge domains (like Blender documentation) to ground AI responses.

### 2. **Immersive Audio Experience (In Progress)** 🎧
- **Gemini Native TTS**: High-quality, context-aware narration using Gemini 2.5/2.0 Native Audio capabilities (replacing legacy Python gTTS).
- **Character-Driven**: Voices that match the persona of the AI tutor (Lumina).

### 3. **Diverse Learning Paths** 🗺️
- **Vibe Coding Path**: Narrative-driven coding (Prompt Engineering, Git) set in a sci-fi universe.
- **Dev Campus**: Web Basics (React/TS) and Gen AI application development.
- **3D Creative Lab**: Blender 3D modeling and sculpting.
- **Art Atelier**: Art History and Design Philosophy.
- **Global Communication**: English for global engineers.

---

## 🛠 Tech Stack

- **Frontend**: [React](https://react.dev/) (v19) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI/LLM**: [Google Gemini API](https://ai.google.dev/) via `@google/genai` SDK
- **Backend/Service**: Node.js (Express) for local proxying and audio handling.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State/Routing**: React Context + Custom View-based routing.

---

## 🚀 Getting Started for Engineers

### Prerequisites
- Node.js (v20+ recommended)
- Google Cloud / Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/t012093/learning-platform-from-gemini.git
   cd learning-platform-from-gemini
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Development Environment**
   This starts both the frontend (Vite) and the backend (Express) services.
   ```bash
   npm run dev
   # Frontend: http://localhost:3005
   # Backend (Audio): http://localhost:3006
   ```

---

## 📂 Project Structure

```
/
├── components/          # React Components
│   ├── common/          # Shared UI (Layouts, Buttons, Modals)
│   ├── features/        # Feature-specific components
│       ├── ai/          # AI Course Generator, Chat, Character Views
│       ├── dashboard/   # Main Dashboard & Learning Hub
│       └── ...          # Other domain views (art, blender, programming)
├── context/             # Global Contexts (Theme, etc.)
├── public/              # Static assets & Generated Audio
│   └── data/audio/      # AI-generated course audio files
├── scripts/             # Utility scripts (Legacy Python scripts, new Node tools)
├── services/            # Business Logic & API Clients
│   ├── geminiService.ts # Core Gemini API integration (Text & Audio)
│   └── ...
├── server.js            # Express backend for file ops & audio handling
└── types.ts             # Global TypeScript definitions
```

---

## 🚧 Current Development Focus & Roadmap

We are currently transitioning from a Python-based gTTS architecture to a **Node.js-native Gemini 2.5 TTS** solution.

### Active Issues
- **Issue #3**: **Gemini 2.5 TTS Implementation**
  - Goal: Replace `gTTS` with `@google/genai` SDK native audio generation.
  - Implement "5-Element Prompting" (Audio Profile, Scene, Director's Notes, Context, Transcript) for expressive narration.
- **Issue #4**: **Voice Selection Feature**
  - Goal: Allow users to select different voice personalities (e.g., 'Kore', 'Puck') for the AI tutor.
- **Issue #6**: **Blender HTML Embeddings for Curriculum RAG**
  - Goal: Embed Blender manual HTML and retrieve relevant context to enrich curriculum generation (option 2).
- **Issue #7**: **User Intent Metadata DB + Embedding Memory**
  - Goal: Extract structured intent from chat, embed it, and persist personalized context for future sessions.
- **Issue #8**: **Blender Image Metadata & Retrieval**
  - Goal: Enrich image metadata (caption/context/tags), improve search (BM25/vector), and support JP queries for curriculum generation.

### How to Contribute
1. Check the [Issues](https://github.com/t012093/learning-platform-from-gemini/issues) tab.
2. Read the specific Issue description (e.g., Issue #3 for the TTS architecture).
3. Follow the project's coding style (Functional React components, TypeScript, Tailwind).

---

<div align="center">
  <sub>Built with ❤️ by the Lumina Team</sub>
</div>
