/**
 * Video Engine - Main Export
 * Complete AI Video Factory orchestration
 */

export * from './types';
export { DirectorAI, directorAI } from './director';
export { SceneGenerator, sceneGenerator } from './scene-generator';
export { ViralScorer, viralScorer } from './viral-scorer';
export { FFmpegRenderer, ffmpegRenderer } from './ffmpeg-renderer';
export { QueueManager, queueManager } from './queue-manager';

import { DirectorAI } from './director';
import { SceneGenerator } from './scene-generator';
import { ViralScorer } from './viral-scorer';
import { FFmpegRenderer } from './ffmpeg-renderer';
import { QueueManager } from './queue-manager';
import { VideoProject, VideoVariation } from './types';

/**
 * Main Video Engine Orchestrator
 * Coordinates all video generation components
 */
export class VideoEngine {
  private director = new DirectorAI();
  private sceneGen = new SceneGenerator();
  private scorer = new ViralScorer();
  private renderer = new FFmpegRenderer();
  private queue = new QueueManager();

  async createProject(params: any): Promise<VideoProject> {
    return this.director.generateContentPlan(params);
  }

  async generateAssets(projectId: string, project: VideoProject) {
    for (const scene of project.scenes) {
      const assets = await this.sceneGen.generateAllAssets(scene);
      // Store assets in database
    }
  }

  async scoreVariations(variations: VideoVariation[]) {
    return this.scorer.scoreMultiple(variations);
  }

  async queueRender(projectId: string, sceneId: string, variationId?: string) {
    return this.queue.addJob({ projectId, sceneId, variationId });
  }

  getQueueStatus() {
    return this.queue.getQueueStats();
  }

  getJob(jobId: string) {
    return this.queue.getJob(jobId);
  }
}

export const videoEngine = new VideoEngine();

