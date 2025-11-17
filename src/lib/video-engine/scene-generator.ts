/**
 * Scene Generator
 * Generates video and image assets using Z.ai APIs
 */

import { getZAIClient } from '@/lib/z-ai/client';
import { VideoScene, ImageGenerationParams, VideoGenerationParams } from './types';

export class SceneGenerator {
  private zai = getZAIClient();

  async generateSceneVideo(scene: VideoScene): Promise<string> {
    try {
      const params: VideoGenerationParams = {
        prompt: scene.viduPrompt,
        duration: scene.duration || 5,
        resolution: '1920x1080',
      };

      const response = await this.zai.generateVideo(params);
      return response.video_url || response.url || '';
    } catch (error) {
      console.error('Video generation error:', error);
      throw error;
    }
  }

  async generateSceneImages(scene: VideoScene): Promise<string[]> {
    try {
      const imageUrls: string[] = [];

      for (const prompt of scene.cogviewPrompts) {
        const params: ImageGenerationParams = {
          prompt,
          size: '1024x1024',
          style: 'cinematic',
          num_images: 1,
        };

        const response = await this.zai.generateImage(params);
        const url = response.image_url || response.url || response.data?.[0]?.url;
        if (url) imageUrls.push(url);
      }

      return imageUrls;
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
    }
  }

  async generateAllAssets(scene: VideoScene): Promise<{
    videoUrl: string;
    imageUrls: string[];
  }> {
    try {
      const [videoUrl, imageUrls] = await Promise.all([
        this.generateSceneVideo(scene),
        this.generateSceneImages(scene),
      ]);

      return { videoUrl, imageUrls };
    } catch (error) {
      console.error('Asset generation error:', error);
      throw error;
    }
  }
}

export const sceneGenerator = new SceneGenerator();

