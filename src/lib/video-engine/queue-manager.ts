/**
 * Queue Manager
 * Manages video rendering queue and job processing
 */

import { RenderJob } from './types';

interface QueueJob {
  id: string;
  projectId: string;
  sceneId: string;
  variationId?: string;
  status: 'queued' | 'processing' | 'complete' | 'failed';
  priority: number;
  retries: number;
  maxRetries: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export class QueueManager {
  private queue: Map<string, QueueJob> = new Map();
  private processing = false;
  private maxConcurrent = 2;
  private activeJobs = 0;

  addJob(params: {
    projectId: string;
    sceneId: string;
    variationId?: string;
    priority?: number;
  }): string {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const job: QueueJob = {
      id: jobId,
      projectId: params.projectId,
      sceneId: params.sceneId,
      variationId: params.variationId,
      status: 'queued',
      priority: params.priority || 0,
      retries: 0,
      maxRetries: 3,
      createdAt: new Date(),
    };

    this.queue.set(jobId, job);
    this.processQueue();
    return jobId;
  }

  getJob(jobId: string): QueueJob | undefined {
    return this.queue.get(jobId);
  }

  getAllJobs(): QueueJob[] {
    return Array.from(this.queue.values());
  }

  getQueueStats() {
    const jobs = Array.from(this.queue.values());
    return {
      total: jobs.length,
      queued: jobs.filter(j => j.status === 'queued').length,
      processing: jobs.filter(j => j.status === 'processing').length,
      complete: jobs.filter(j => j.status === 'complete').length,
      failed: jobs.filter(j => j.status === 'failed').length,
    };
  }

  private async processQueue() {
    if (this.processing || this.activeJobs >= this.maxConcurrent) return;

    this.processing = true;
    const queuedJobs = Array.from(this.queue.values())
      .filter(j => j.status === 'queued')
      .sort((a, b) => b.priority - a.priority);

    for (const job of queuedJobs) {
      if (this.activeJobs >= this.maxConcurrent) break;

      job.status = 'processing';
      job.startedAt = new Date();
      this.activeJobs++;

      // Job processing happens in API route
      // This just manages the queue state
    }

    this.processing = false;
  }

  completeJob(jobId: string, videoUrl: string) {
    const job = this.queue.get(jobId);
    if (job) {
      job.status = 'complete';
      job.completedAt = new Date();
      this.activeJobs--;
      this.processQueue();
    }
  }

  failJob(jobId: string, error: string) {
    const job = this.queue.get(jobId);
    if (job) {
      if (job.retries < job.maxRetries) {
        job.retries++;
        job.status = 'queued';
      } else {
        job.status = 'failed';
        job.error = error;
      }
      this.activeJobs--;
      this.processQueue();
    }
  }
}

export const queueManager = new QueueManager();

