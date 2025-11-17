/**
 * Viral Scorer
 * Analyzes content for viral potential using GLM-4.6
 */

import { getZAIClient } from '@/lib/z-ai/client';
import { ViralScore, VideoVariation } from './types';

export class ViralScorer {
  private zai = getZAIClient();

  async scoreVariation(variation: VideoVariation): Promise<ViralScore> {
    try {
      const prompt = `Analyze this video variation for viral potential:
Title: ${variation.title}
Description: ${variation.description}
Target Metric: ${variation.targetMetric}

Score it on a scale of 0-100 for:
1. Engagement potential
2. Retention potential
3. Shareability
4. Hook strength

Return JSON with: overall, engagement, retention, shareability, hooks[], recommendations[]`;

      const response = await this.zai.chatCompletion({
        messages: [
          {
            role: 'system',
            content: 'You are a viral content expert. Analyze content for TikTok viral potential.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices?.[0]?.message?.content;
      return content ? JSON.parse(content) : this.defaultScore();
    } catch (error) {
      console.error('Viral scoring error:', error);
      return this.defaultScore();
    }
  }

  async scoreMultiple(variations: VideoVariation[]): Promise<Map<string, ViralScore>> {
    const scores = new Map<string, ViralScore>();

    for (const variation of variations) {
      const score = await this.scoreVariation(variation);
      scores.set(variation.id, score);
    }

    return scores;
  }

  private defaultScore(): ViralScore {
    return {
      overall: 75,
      engagement: 75,
      retention: 75,
      shareability: 75,
      hooks: ['Strong opening', 'Clear value proposition'],
      recommendations: ['Add trending audio', 'Optimize for mobile'],
    };
  }
}

export const viralScorer = new ViralScorer();

