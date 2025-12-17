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
- **Big5 Personality Integration**: AI dynamically adapts curriculum content, tone, and learning style based on your Big5 personality traits (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism).
- **Rich Content Generation**: Lessons go beyond summaries, providing 'Why It Matters' (motivation), 'Key Concepts' (core knowledge), 'Action Steps' (practical exercises), and 'Analogies' (intuitive understanding).
- **Advanced AI Models**: Utilize Google Gemini 3.0 Pro for deep reasoning and Gemini 2.0 Flash for quick, efficient generation.
- **RAG (Retrieval-Augmented Generation) Ready**: Designed to integrate with external knowledge bases (e.g., existing static content) to ground AI responses and minimize hallucinations, ensuring accuracy and relevance.

### 2. **Vibe Coding Path** 🟣
An immersive, story-driven approach to coding.
- **Narrative**: You are the pilot of an AI-driven spacecraft.
- **Concept**: Learn "Prompt Engineering", "Copilot", and "Git" not as tools, but as extensions of your will.
- **Style**: Dark mode, cinematic UI, ambient soundscapes.

### 3. **Dev Campus (Web Basic & Gen AI)** 🌐
A solid foundation for modern developers.
- **Web Basic**: React, TypeScript, TailwindCSS from scratch.
- **Gen AI Camp**: Python, LLM integration, and AI application development.

### 4. **3D Creative Lab** 🟠
Unlock your spatial creativity with Blender.
- **Curriculum**: Modeling, Sculpting, and Geometry Nodes.
- **Visuals**: Clean, grid-based gallery UI.

### 5. **Art Atelier** 🟤
Explore the intersection of technology and aesthetics.
- **Content**: Art History, Color Theory, and Design Philosophy.
- **Atmosphere**: Museum-like quiet and elegant interface.

### 6. **Global Communication** 🟢
English for Global Engineers.
- **Focus**: Practical technical reading, documentation, and cross-cultural communication.

---

## 🛠 Tech Stack

Built with a focus on performance, aesthetics, and developer experience.

- **Framework**: [React](https://react.dev/) (v19) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI/LLM**: [Google Gemini API](https://ai.google.dev/) (Gemini 3.0 Pro, Gemini 2.0 Flash)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Audio**: Native HTML5 Audio API for Vibe tracks

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- **Google Gemini API Key**: Set `GEMINI_API_KEY` in a `.env` file at the project root.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/t012093/learning-platform-from-gemini.git
   cd learning-platform-from-gemini
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Verify**
   Open the URL provided by Vite (e.g., [http://localhost:3005](http://localhost:3005)) to view the app.
   - Navigate to the Dashboard and click "AI Generator" to try the personalized curriculum feature.

---

## 📂 Project Structure

The codebase is organized using a **Feature-Based Architecture** for improved modularity and maintainability.

```
/src
  /components
    /common          # Shared UI components (Layout, Buttons, Modals, ErrorBoundary, Library, Login related)
    /features
      /ai            # AI Course Generator, Personalized Lessons, AI Chat, AI Characters
      /art           # Art Museum, Art History, Crafts, Tribal Art curriculums
      /blender       # Blender 3D modeling curriculums
      /dashboard     # Main Dashboard, Course List, Learning Hub, My Content, Profile Passport
      /programming   # Programming (Python, HTML/CSS, Web Inspector, Vibe Coding) curriculums
      /sonic         # Sonic Lab, Sonic Synth modules
  /context           # React Context APIs (e.g., ThemeContext)
  /services          # API clients (Gemini, Adachi mock), Data providers
  /types             # TypeScript type definitions (Views, Course Data, Big5 Profile)
  App.tsx            # Main Application entry point and custom router
  index.html         # HTML entry point
  index.tsx          # React app mount point
  vite.config.ts     # Vite configuration
  ...
```

---

## 🎨 Design System (Lumina UI)

To maintain the coherent "Lumina Aesthetic", please adhere to these guidelines:

### Typography
- **Font**: Sans-serif (System default or Inter)
- **Tracking**: `tracking-tight` on all Heads (H1-H3).
- **Color**: `text-slate-700` (Light Mode) / `text-slate-200` (Dark/Vibe Mode).

### Color Palette
- **Primary**: Indigo (`indigo-600`) - Logic / Core
- **Vibe**: Purple (`purple-600`) - Intuition / AI
- **Creative**: Orange (`orange-500`) - 3D / Making
- **Global**: Teal (`teal-500`) - English / Connection
- **Art**: Stone (`stone-600`) - History / Grounding

### Layout Principles
- **Grid**: 3-Column standard for dashboards.
- **Card**: Rounded corners (`rounded-2xl` or `rounded-3xl`), subtle borders, soft shadows.
- **Motion**: Gentle hover effects (`hover:-translate-y-1`), avoiding jarring movements.

---

<div align="center">
  <sub>Built with ❤️ by the Lumina Team</sub>
</div>