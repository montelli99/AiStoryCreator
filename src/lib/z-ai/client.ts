/**
 * Z.ai API Client Wrapper
 * Handles all interactions with Z.ai models:
 * - CogView-4 (Image Generation)
 * - Vidu-Q1 (Video Generation) 
 * - GLM-4.6 (LLM, Director AI)
 */

export class ZAIClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.z.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Z.ai API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Generate images using CogView-4
   */
  async generateImage(params: {
    prompt: string;
    size?: string;
    style?: string;
    num_images?: number;
  }) {
    return this.makeRequest('/image/cogview-4', {
      method: 'POST',
      body: JSON.stringify({
        prompt: params.prompt,
        size: params.size || '1024x1024',
        style: params.style || 'photorealistic',
        num_images: params.num_images || 1,
      }),
    });
  }

  /**
   * Generate videos using Vidu-Q1
   */
  async generateVideo(params: {
    prompt: string;
    duration?: number;
    resolution?: string;
    consistency_anchor?: string;
  }) {
    return this.makeRequest('/video/vidu-q1', {
      method: 'POST',
      body: JSON.stringify({
        prompt: params.prompt,
        duration: params.duration || 5,
        resolution: params.resolution || '1920x1080',
        consistency_anchor: params.consistency_anchor,
      }),
    });
  }

  /**
   * Chat completions using GLM-4.6
   * Used for Director AI, planning, and analysis
   */
  async chatCompletion(params: {
    messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }>;
    model?: string;
    temperature?: number;
    max_tokens?: number;
    response_format?: {
      type: 'json_object' | 'text';
    };
  }) {
    return this.makeRequest('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: params.model || 'glm-4.6',
        messages: params.messages,
        temperature: params.temperature || 0.7,
        max_tokens: params.max_tokens || 2000,
        response_format: params.response_format || { type: 'text' },
      }),
    });
  }

  /**
   * Generate structured content plan using GLM-4.6
   * Specifically for Director AI functionality
   */
  async generateContentPlan(params: {
    characterCode: string;
    characterData: {
      ethnicity: string;
      baseAge: number;
      variant: string;
      aestheticType: string;
    };
    product?: string;
    analytics?: any;
    trendData?: any;
  }) {
    const systemPrompt = `You are the Director AI for AI Creator Studio. 
You specialize in creating cinematic and influencer content for AI-generated characters.

Your task is to generate a comprehensive content plan that includes:
1. Scene description and setup
2. Lighting and camera directions
3. Pacing and timing
4. Hook lines for engagement
5. Video generation prompts
6. Image reference prompts
7. Voiceover scripts
8. Performance variations for A/B testing

Always respond with valid JSON that follows the specified structure.`;

    const userPrompt = `
Generate a content plan for the following:

Character: ${params.characterCode}
Ethnicity: ${params.characterData.ethnicity}
Age: ${params.characterData.baseAge}
Variant: ${params.characterData.variant}
Aesthetic: ${params.characterData.aestheticType}
${params.product ? `Product: ${params.product}` : ''}
${params.analytics ? `Performance History: ${JSON.stringify(params.analytics)}` : ''}
${params.trendData ? `Current Trends: ${JSON.stringify(params.trendData)}` : ''}

Create a plan optimized for ${params.characterData.aestheticType} content that appeals to ${params.characterData.ethnicity} male demographics aged ${params.characterData.baseAge}.

Return a JSON object with this exact structure:
{
  "scene": "detailed scene description",
  "lighting": "lighting setup description", 
  "cameraMotion": "camera movement description",
  "pacing": "pacing and timing description",
  "hookLine": "attention-grabbing opening line",
  "viduPrompt": "detailed prompt for video generation",
  "cogviewPrompts": ["prompt1", "prompt2", "prompt3"],
  "voiceoverScript": "complete voiceover script",
  "variations": [
    {
      "title": "Variation 1",
      "description": "description of variation",
      "viduPrompt": "alternative video prompt",
      "targetMetric": "engagement"
    },
    {
      "title": "Variation 2",
      "description": "description of variation", 
      "viduPrompt": "alternative video prompt",
      "targetMetric": "retention"
    }
  ]
}`;

    return this.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    });
  }

  /**
   * Analyze content performance and provide optimization suggestions
   */
  async analyzePerformance(params: {
    contentData: any;
    analytics: any;
    characterData: any;
  }) {
    const systemPrompt = `You are a content optimization AI for AI Creator Studio.
Analyze content performance and provide actionable insights for improvement.

Focus on:
1. Engagement patterns
2. Character performance
3. Content type effectiveness
4. Optimization recommendations
5. A/B testing insights

Always respond with valid JSON.`;

    const userPrompt = `
Analyze the following content performance:

Content Data: ${JSON.stringify(params.contentData)}
Analytics: ${JSON.stringify(params.analytics)}
Character Data: ${JSON.stringify(params.characterData)}

Provide analysis and recommendations in this JSON format:
{
  "performanceScore": 85.5,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": [
    {
      "category": "content",
      "action": "specific action to take",
      "impact": "high|medium|low",
      "description": "detailed explanation"
    }
  ],
  "nextOptimal": {
    "character": "ID_XX_X",
    "aesthetic": "cinematic|influencer",
    "content": "video|image",
    "timing": "optimal posting time"
  }
}`;

    return this.chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });
  }
}

// Singleton instance for the application
let zaiClient: ZAIClient | null = null;

export function getZAIClient(): ZAIClient {
  if (!zaiClient) {
    const apiKey = process.env.ZAI_API_KEY;
    if (!apiKey) {
      throw new Error('ZAI_API_KEY environment variable is not set');
    }
    zaiClient = new ZAIClient(apiKey);
  }
  return zaiClient;
}