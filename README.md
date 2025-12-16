<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1P7UWTr6Nyjh_aX1QW5cJJfdKwDX0nbfN

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Design System Guidelines (Updated v2.0)

Design principles to maintain the "Lumina" brand aesthetic.

### 1. Typography (The "Grounded" Text)
To prevent black text from looking "floating" or "harsh" on white backgrounds, we follow these rules:

*   **Color**: Use **Slate-700** (`text-slate-700`) for primary headings and body text. Avoid pure black or `slate-900`.
*   **Tracking**: Apply **`tracking-tight`** to all headings (H1-H3) and important labels. This "tightens" the font rendering, creating a premium, print-like quality.
    *   *Example*: `<h1 className="text-slate-700 font-bold tracking-tight">`

### 2. Color Palette ("Airy" Light Theme)
*   **Backgrounds**: Use **White** (`bg-white`) or very subtle Slate (`bg-slate-50`). Avoid heavy dark gradients for main content areas unless it's a specific "immersive" mode (like the Art Museum).
*   **Cards**: White cards with subtle borders (`border-slate-100/200`) and soft shadows (`shadow-sm` -> `hover:shadow-xl`).
*   **Accents**: Use specific colors (Indigo, Cyan, Orange) only for icons/badges to differentiate categories.

### 3. Layout (3-Column Grid)
*   **Learning Hub**: Content cards should be compact enough to fit **3 columns** on desktop (`lg:grid-cols-3`).
*   **Responsiveness**:
    *   Mobile: 1 Column
    *   Tablet: 2 Columns
    *   Desktop: 3 Columns
