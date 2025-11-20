"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2, Download, Code2, FileArchive, Terminal, Copy, Check, ChevronDown, ChevronUp, Sparkles as SparklesIcon, Zap, Github } from "lucide-react"
import { Sparkles } from "@/components/ui/sparkles"
import { MovingGrid } from "@/components/ui/moving-grid"

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [copied, setCopied] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
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

  const copyPromptToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPrompt)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
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
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white font-sans selection:bg-white/10 relative overflow-hidden">
      {/* Enhanced Background Layers */}
      <MovingGrid gridSize={34} lineWidth={1} lineColor="rgba(21, 9, 9, 0.11)" speed={.15} />
      <Sparkles density={80} speed={0.4} size={3} color="rgba(241, 232, 232, 0.53)" />
      
      {/* Dynamic gradient overlays */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.03),rgba(0,0,0,0))] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      <main className="relative max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-8 z-10">
        {/* Enhanced Header with badges */}
        <header className="space-y-6 text-center md:text-left pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 text-zinc-300 text-sm mb-4">
            <Zap className="w-4 h-4" />
            <span className="font-medium">Powered by Gemini Pro</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
            <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent drop-shadow-2xl">
              PyCase Forge
            </span>
          </h1>
          
          <p className="text-zinc-400 max-w-2xl text-lg md:text-xl font-light leading-relaxed">
            AI-powered test case generation for Python. Create comprehensive test suites with random cases and edge cases in seconds.
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>AI-Generated</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400">
              <Code2 className="w-3.5 h-3.5" />
              <span>Production Ready</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>Standalone Scripts</span>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Form - Enhanced */}
          <section className="space-y-4">
            <div className="backdrop-blur-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/20 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] ring-1 ring-white/10 hover:border-white/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                <div className="p-2 rounded-xl bg-white/10 border border-white/20">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Configuration</h2>
                  <p className="text-xs text-zinc-500">Define your test parameters</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400 font-semibold ml-1">
                    <Zap className="w-3.5 h-3.5 text-zinc-400" />
                    Google AI API Key
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all hover:border-white/20"
                    placeholder="sk-..."
                    value={formData.apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                  />
                  <p className="text-xs text-zinc-600 ml-1 flex items-center gap-1.5">
                    <span>Get your key from</span>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-zinc-200 underline underline-offset-2 font-medium"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold ml-1">
                    Problem Description
                  </label>
                  <textarea
                    required
                    className="w-full h-36 bg-black/60 border border-white/10 rounded-xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all resize-none hover:border-white/20"
                    placeholder="Example: Given an array of integers, find two numbers that add up to a target sum..."
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold ml-1">
                    Solution Code
                  </label>
                  <textarea
                    required
                    className="w-full h-52 bg-black/60 border border-white/10 rounded-xl p-4 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all resize-none hover:border-white/20"
                    placeholder="def solution(arr, target):&#10;    # Your code here&#10;    pass"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold ml-1">
                      Random Tests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all hover:border-white/20"
                      value={formData.numTests}
                      onChange={(e) => setFormData({ ...formData, numTests: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold ml-1">
                      Edge Cases
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all hover:border-white/20"
                      value={formData.numEdge}
                      onChange={(e) => setFormData({ ...formData, numEdge: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold ml-1">
                    Output Filename
                  </label>
                  <div className="relative">
                    <FileArchive className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3.5 pl-11 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all hover:border-white/20"
                      value={formData.zipName}
                      onChange={(e) => setFormData({ ...formData, zipName: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full bg-gradient-to-r from-white to-zinc-200 hover:from-zinc-100 hover:to-white text-black font-semibold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2.5 group shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                      <span className="relative z-10">Generating...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform relative z-10" />
                      <span className="relative z-10">Generate Test Script</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* Output Section - Enhanced */}
          <section className="relative h-full min-h-[600px]">
            <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/20 rounded-3xl overflow-hidden flex flex-col shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] ring-1 ring-white/10 hover:border-white/30 transition-all duration-300">
              <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-white/[0.05] to-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10 border border-white/20">
                    <Terminal className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">Generated Output</span>
                    <p className="text-xs text-zinc-500">Ready to use Python script</p>
                  </div>
                </div>
                {result && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-xs font-medium group"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span className="text-white">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                          <span className="text-zinc-400 group-hover:text-white transition-colors">Copy</span>
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
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all text-xs font-medium group"
                    >
                      <Download className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white transition-colors" />
                      <span className="text-zinc-300 group-hover:text-white transition-colors">Download</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-auto p-5 font-mono text-sm text-zinc-300 custom-scrollbar">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-5">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-zinc-400/40 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="animate-pulse font-medium">Generating test cases...</p>
                      <p className="text-xs text-zinc-600">AI is crafting your perfect test suite</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-white mb-4">
                      <Check className="w-4 h-4" />
                      <span className="font-medium">Generation complete</span>
                    </div>
                    <pre className="whitespace-pre-wrap break-words leading-relaxed">{result}</pre>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <Code2 className="w-16 h-16 opacity-30" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="font-medium">Awaiting generation</p>
                      <p className="text-xs text-zinc-700">Fill the form and click generate</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Prompt Viewer - Enhanced */}
        {generatedPrompt && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="backdrop-blur-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/20 rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] ring-1 ring-white/10 hover:border-white/30 transition-all duration-300">
              <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-white/[0.05] to-transparent hover:from-white/[0.08] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10 border border-white/20 group-hover:bg-white/20 transition-colors">
                    <Code2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold text-white">Prompt Preview</span>
                    <p className="text-xs text-zinc-500">View the exact AI prompt</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {generatedPrompt && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyPromptToClipboard()
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-xs font-medium"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span className="text-white">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="text-zinc-400">Copy</span>
                        </>
                      )}
                    </button>
                  )}
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    {showPrompt ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                </div>
              </button>
              
              {showPrompt && (
                <div className="p-5 max-h-96 overflow-auto custom-scrollbar border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
                  <pre className="whitespace-pre-wrap break-words text-sm text-zinc-400 font-mono leading-relaxed">
                    {generatedPrompt}
                  </pre>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center py-8 text-zinc-600 text-sm border-t border-white/5 mt-12">
          <p>Built with ❤️ using Next.js, Tailwind CSS & Gemini Pro</p>
        </footer>
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
