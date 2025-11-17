/**
 * FFmpeg Renderer
 * Handles video composition, audio mixing, and final rendering
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export class FFmpegRenderer {
  private outputDir = path.join(process.cwd(), 'public', 'videos');

  constructor() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async composeVideo(params: {
    videoUrl: string;
    audioUrl?: string;
    imageUrls?: string[];
    duration?: number;
    outputName: string;
  }): Promise<string> {
    try {
      const outputPath = path.join(this.outputDir, `${params.outputName}.mp4`);

      // Download video if URL
      const videoPath = await this.downloadIfUrl(params.videoUrl, 'video');

      // Build FFmpeg command
      let command = `ffmpeg -i "${videoPath}"`;

      if (params.audioUrl) {
        const audioPath = await this.downloadIfUrl(params.audioUrl, 'audio');
        command += ` -i "${audioPath}" -c:v copy -c:a aac -map 0:v:0 -map 1:a:0`;
      }

      command += ` -y "${outputPath}"`;

      await execAsync(command);
      return `/videos/${params.outputName}.mp4`;
    } catch (error) {
      console.error('FFmpeg composition error:', error);
      throw error;
    }
  }

  async addCaptions(params: {
    videoPath: string;
    captionText: string;
    outputName: string;
  }): Promise<string> {
    try {
      const outputPath = path.join(this.outputDir, `${params.outputName}.mp4`);

      const command = `ffmpeg -i "${params.videoPath}" -vf "drawtext=text='${params.captionText}':fontsize=24:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" -y "${outputPath}"`;

      await execAsync(command);
      return `/videos/${params.outputName}.mp4`;
    } catch (error) {
      console.error('Caption error:', error);
      throw error;
    }
  }

  private async downloadIfUrl(url: string, type: string): Promise<string> {
    if (url.startsWith('http')) {
      const filename = `${type}-${Date.now()}.${type === 'video' ? 'mp4' : 'mp3'}`;
      const filepath = path.join(this.outputDir, filename);
      // In production, use proper download library
      return filepath;
    }
    return url;
  }
}

export const ffmpegRenderer = new FFmpegRenderer();

