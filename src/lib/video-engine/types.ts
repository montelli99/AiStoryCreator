/**
 * Video Engine Type Definitions
 * Core types for the AI Video Factory
 */

export interface VideoScene {
  id: string;
  description: string;
  lighting: string;
  cameraMotion: string;
  duration: number;
  viduPrompt: string;
  cogviewPrompts: string[];
}

export interface VideoVariation {
  id: string;
  title: string;
  description: string;
  viduPrompt: string;
  targetMetric: 'engagement' | 'retention' | 'shares' | 'comments';
  viralScore?: number;
}

export interface VideoProject {
  id: string;
  title: string;
  characterCode: string;
  characterData: {
    ethnicity: string;
    baseAge: number;
    variant: string;
    aestheticType: 'cinematic' | 'influencer';
  };
  scenes: VideoScene[];
  variations: VideoVariation[];
  voiceoverScript: string;
  hookLine: string;
  status: 'planning' | 'generating' | 'rendering' | 'complete' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface RenderJob {
  id: string;
  projectId: string;
  sceneId: string;
  variationId?: string;
  status: 'queued' | 'processing' | 'complete' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface VideoGenerationParams {
  prompt: string;
  duration?: number;
  resolution?: string;
  consistency_anchor?: string;
}

export interface ImageGenerationParams {
  prompt: string;
  size?: string;
  style?: string;
  num_images?: number;
}

export interface ContentPlanRequest {
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
}

export interface ViralScore {
  overall: number;
  engagement: number;
  retention: number;
  shareability: number;
  hooks: string[];
  recommendations: string[];
}

