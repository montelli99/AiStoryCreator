import { zClient } from "@/src/lib/z-ai/client"

export class ViralBrain {
  async analyzeScript(script: string) {
    const prompt = `
You are a viral video strategist. Analyze this script and return:
- 3 viral angles
- 3 hooks
- What emotion it triggers
- Why it will perform well on TikTok
- A score from 1-100

Return JSON only.

SCRIPT:
${script}
    `

    const completion = await zClient.completions.create({
      model: "glm-4-6",
      prompt,
      temperature: 0.4,
    })

    return JSON.parse(completion.output_text)
  }
}

