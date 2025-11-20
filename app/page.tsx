"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2, Download, Code2, FileArchive, Terminal, Copy, Check, ChevronDown, ChevronUp } from "lucide-react"

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [copied, setCopied] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [formData, setFormData] = useState({
    apiKey: "",
    problem: "",
    code: "",
    numTests: 10,
    numEdge: 5,
    zipName: "test_cases.zip",
  })

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("gemini_api_key")
    if (savedApiKey) {
      setFormData((prev) => ({ ...prev, apiKey: savedApiKey }))
    }
  }, [])

  // Generate prompt preview whenever form data changes
  useEffect(() => {
    if (formData.problem && formData.code) {
      const prompt = `You are an expert Python developer.
Task: Create a standalone Python script that generates test cases and runs a user's solution against them.

User's Problem Description:
"""
${formData.problem}
"""

User's Solution Code:
"""
${formData.code}
"""

Requirements for the Python script:
1. It must generate ${formData.numTests} random test cases based on the problem description.
2. It must generate ${formData.numEdge} specific edge cases (e.g., min/max values, empty inputs, etc.).
3. It must create a directory structure:
   - input/
   - output/
4. For each test case (i=0 to ${Number(formData.numTests) + Number(formData.numEdge) - 1}):
   - Write the input data to 'input/input{i}.txt'.
   - Run the User's Solution Code logic on this input.
   - Capture the standard output and write it to 'output/output{i}.txt'.
5. Finally, compress the 'input' and 'output' directories into a zip file named "${formData.zipName || "test_cases.zip"}".
6. The script must be self-contained. Include the User's Solution Code directly inside the script (e.g., as a function or wrapped logic) so it can be executed easily.
7. Use the 'zipfile', 'os', 'shutil', and 'random' modules as needed.
8. Ensure the script cleans up the 'input' and 'output' directories before starting if they exist, or handles them gracefully.

OUTPUT FORMAT:
Return ONLY the raw Python code. Do not wrap it in markdown code blocks (like \`\`\`python). Do not include any explanations. Just the code.`
      setGeneratedPrompt(prompt)
    } else {
      setGeneratedPrompt("")
    }
  }, [formData.problem, formData.code, formData.numTests, formData.numEdge, formData.zipName])

  // Save API key to localStorage whenever it changes
  const handleApiKeyChange = (value: string) => {
    setFormData({ ...formData, apiKey: value })
    localStorage.setItem("gemini_api_key", value)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult("")
    setCopied(false)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to generate: ${errorText}`)
      }

      const text = await res.text()
      setResult(text)
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black pointer-events-none" />

      <main className="relative max-w-5xl mx-auto p-6 md:p-12 space-y-12">
        <header className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            Test Case Generator
          </h1>
          <p className="text-zinc-400 max-w-xl text-lg font-light">
            Generate robust Python test scripts powered by Gemini 1.5 Pro.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <section className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl ring-1 ring-white/5">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium ml-1">
                    Google AI API Key
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    placeholder="Enter your Gemini API key..."
                    value={formData.apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                  />
                  <p className="text-xs text-zinc-600 ml-1">
                    Get your key from{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium ml-1">
                    Problem Description
                  </label>
                  <textarea
                    required
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
                    placeholder="Describe the problem constraints and logic..."
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium ml-1">
                    Solution Code
                  </label>
                  <textarea
                    required
                    className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
                    placeholder="Paste your Python solution here..."
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium ml-1">
                      Random Tests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                      value={formData.numTests}
                      onChange={(e) => setFormData({ ...formData, numTests: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium ml-1">
                      Edge Cases
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                      value={formData.numEdge}
                      onChange={(e) => setFormData({ ...formData, numEdge: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium ml-1">
                    Zip Filename
                  </label>
                  <div className="relative">
                    <FileArchive className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-10 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                      value={formData.zipName}
                      onChange={(e) => setFormData({ ...formData, zipName: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-medium py-4 rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Code2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Generate Script
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* Output Section */}
          <section className="relative h-full min-h-[500px]">
            <div className="absolute inset-0 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/5">
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Terminal className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Output</span>
                </div>
                {result && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="text-xs flex items-center gap-2 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([result], { type: "text/x-python" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = "generate_tests.py"
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                      }}
                      className="text-xs flex items-center gap-2 hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download .py
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-auto p-4 font-mono text-sm text-zinc-300 custom-scrollbar">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                    <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                    <p className="animate-pulse">Constructing logic...</p>
                  </div>
                ) : result ? (
                  <pre className="whitespace-pre-wrap break-words">{result}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-2">
                    <Code2 className="w-12 h-12 opacity-20" />
                    <p>Ready to generate</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Collapsible Prompt Viewer */}
        {generatedPrompt && (
          <section className="space-y-4">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
              <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="w-full flex items-center justify-between p-4 border-b border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 text-zinc-400">
                  <Code2 className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Prompt Preview</span>
                </div>
                {showPrompt ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>
              
              {showPrompt && (
                <div className="p-4 max-h-96 overflow-auto custom-scrollbar">
                  <pre className="whitespace-pre-wrap break-words text-sm text-zinc-400 font-mono">
                    {generatedPrompt}
                  </pre>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
