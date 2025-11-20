import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { apiKey, problem, code, numTests, numEdge, zipName } = await req.json()

    if (!problem || !code) {
      return new Response("Missing problem description or code", { status: 400 })
    }

    if (!apiKey) {
      return new Response("API key is required", { status: 400 })
    }

    const prompt = `
You are an expert Python developer.
Task: Create a standalone Python script that generates test cases and runs a user's solution against them.

User's Problem Description:
"""
${problem}
"""

User's Solution Code:
"""
${code}
"""

Requirements for the Python script:
1. It must generate ${numTests} random test cases based on the problem description.
2. It must generate ${numEdge} specific edge cases (e.g., min/max values, empty inputs, etc.).
3. It must create a directory structure:
   - input/
   - output/
4. For each test case (i=0 to ${Number(numTests) + Number(numEdge) - 1}):
   - Write the input data to 'input/input{i}.txt'.
   - Run the User's Solution Code logic on this input.
   - Capture the standard output and write it to 'output/output{i}.txt'.
5. Finally, compress the 'input' and 'output' directories into a zip file named "${zipName || "test_cases.zip"}".
6. The script must be self-contained. Include the User's Solution Code directly inside the script (e.g., as a function or wrapped logic) so it can be executed easily.
7. Use the 'zipfile', 'os', 'shutil', and 'random' modules as needed.
8. Ensure the script cleans up the 'input' and 'output' directories before starting if they exist, or handles them gracefully.

OUTPUT FORMAT:
Return ONLY the raw Python code. Do not wrap it in markdown code blocks (like \`\`\`python). Do not include any explanations. Just the code.
`

    const google = createGoogleGenerativeAI({ apiKey })
    
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: prompt,
      temperature: 0.2, // Low temperature for more deterministic code generation
    })

    // Clean up potential markdown formatting if the model ignores the instruction
    const cleanCode = text.replace(/^```python\n/, "").replace(/\n```$/, "")

    return new Response(cleanCode, {
      headers: { "Content-Type": "text/plain" },
    })
  } catch (error) {
    console.error("Error generating script:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error"
    return new Response(errorMessage, { status: 500 })
  }
}
