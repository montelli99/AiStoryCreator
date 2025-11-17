/**
 * Director AI Engine
 * Orchestrates video planning and scene generation using GLM-4.6
 */

import { getZAIClient } from '@/lib/z-ai/client';
import { ContentPlanRequest, VideoProject, VideoScene, VideoVariation } from './types';

export class DirectorAI {
  private zai = getZAIClient();

  async generateContentPlan(request: ContentPlanRequest): Promise<VideoProject> {
    try {
      const response = await this.zai.generateContentPlan(request);
      const plan = response.choices?.[0]?.message?.content 
        ? JSON.parse(response.choices[0].message.content)
        : response;

      const scenes: VideoScene[] = [
        {
          id: 'scene-1',
          description: plan.scene,
          lighting: plan.lighting,
          cameraMotion: plan.cameraMotion,
          duration: 5,
          viduPrompt: plan.viduPrompt,
          cogviewPrompts: plan.cogviewPrompts || [],
        }
      ];

      const variations: VideoVariation[] = (plan.variations || []).map((v: any, i: number) => ({
        id: `var-${i + 1}`,
        title: v.title,
        description: v.description,
        viduPrompt: v.viduPrompt,
        targetMetric: v.targetMetric || 'engagement',
      }));

      return {
        id: `proj-${Date.now()}`,
        title: `${request.characterCode} Content Plan`,
        characterCode: request.characterCode,
        characterData: request.characterData,
        scenes,
        variations,
        voiceoverScript: plan.voiceoverScript,
        hookLine: plan.hookLine,
        status: 'planning',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Director AI error:', error);
      throw error;
    }
  }

  async analyzePerformance(projectId: string, analytics: any) {
    try {
      const response = await this.zai.analyzePerformance({
        contentData: { projectId },
        analytics,
        characterData: {},
      });

      return response.choices?.[0]?.message?.content 
        ? JSON.parse(response.choices[0].message.content)
        : response;
    } catch (error) {
      console.error('Performance analysis error:', error);
      throw error;
    }
  }
}

export const directorAI = new DirectorAI();

