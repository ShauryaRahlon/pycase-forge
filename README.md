# ⚒️ PyCase Forge

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini-8E75B2?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)

**Automate the grunt work of Competitive Programming & DSA testing.** Generate standalone Python test-case scripts instantly using AI.

[Report Bug](https://github.com/yourusername/pycase-forge/issues) · [Request Feature](https://github.com/yourusername/pycase-forge/issues)

</div>

---

## 🚀 What is PyCase Forge?

**PyCase Forge** is a bleeding-edge web application designed to help developers, students, and competitive programmers generate robust test suites for their Python solutions.

Stop writing manual `random.randint()` scripts. Simply provide your problem description and your solution code, and PyCase Forge leverages **Google's Gemini AI** to architect a standalone Python script that:

1.  Generates random test cases based on your specific constraints.
2.  Identifies and generates tricky **edge cases** (min/max boundaries, nulls, etc.).
3.  Runs your solution against these inputs.
4.  Captures the standard output.
5.  Zips everything into a neat `test_cases.zip` ready for upload or local testing.

## ✨ Features

* **🧠 AI-Driven Logic:** Uses the Vercel AI SDK and Gemini to parse natural language problem descriptions.
* **⚡ Bleeding Edge Stack:** Built on **Next.js 16**, **React 19**, and **Tailwind CSS v4**.
* **🎨 Glassmorphism UI:** A beautiful, dark-mode aesthetic powered by **Shadcn UI** and **Lucide Icons**.
* **🧪 Smart Edge Cases:** Specifically prompts the AI to generate corner cases that usually break solutions.
* **📦 One-Click Export:** Generates a fully self-contained, downloadable Python script.
* **🔒 Client-Side Privacy:** API keys are stored securely in your browser's `localStorage`, never on our servers.

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server Actions, React Server Components. |
| **Core** | [React 19](https://react.dev/) | The latest in library evolution. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | The new oxidative engine for lightning-fast styles. |
| **UI Library** | [Shadcn UI](https://ui.shadcn.com/) | Accessible, composable Radix UI primitives. |
| **AI Provider** | [Google Gemini](https://ai.google.dev/) | Via `@ai-sdk/google` for fast, intelligent generation. |
| **Icons** | [Lucide React](https://lucide.dev/) | Beautiful, consistent iconography. |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (Required for Next.js 16)
- pnpm (Recommended) or npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/pycase-forge.git](https://github.com/yourusername/pycase-forge.git)
    cd pycase-forge
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Run the development server**
    ```bash
    pnpm dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 💡 How to Use

1.  **Get an API Key:** Grab a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Enter Details:**
    * Paste your **API Key** (stored locally).
    * Paste the **Problem Description** (e.g., from LeetCode, Codeforces).
    * Paste your working **Python Solution**.
3.  **Configure:** Set the number of random tests and specific edge cases.
4.  **Generate:** Click "Generate Script".
5.  **Run Locally:** Download the generated `.py` file and run it on your machine:
    ```bash
    python3 generate_tests.py
    ```
    *This will create an `input/` folder, an `output/` folder, and a `test_cases.zip` file automatically.*

## 📂 Project Structure

```bash
Directory structure:
└── shauryarahlon-pycase-forge/
    ├── README.md
    ├── components.json
    ├── next.config.mjs
    ├── package.json
    ├── postcss.config.mjs
    ├── tsconfig.json
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── api/
    │       └── generate/
    │           └── route.ts
    ├── components/
    │   ├── theme-provider.tsx
    │   └── ui/
    │      
    ├── hooks/
    │   ├── use-mobile.ts
    │   └── use-toast.ts
    ├── lib/
    │   └── utils.ts
    └── styles/
        └── globals.css
