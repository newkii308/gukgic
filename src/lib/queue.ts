import { logger } from '@/lib/logger';

export type JobType = 'SEND_PUSH_NOTIFICATION' | 'PROCESS_MEDIA' | 'CLEANUP_EXPIRED_SESSIONS';

export interface Job<T = any> {
  id: string;
  type: JobType;
  data: T;
  createdAt: number;
}

type JobHandler<T = any> = (data: T) => Promise<void>;

class BackgroundJobRunner {
  private handlers = new Map<JobType, JobHandler>();

  registerHandler<T>(type: JobType, handler: JobHandler<T>) {
    this.handlers.set(type, handler);
  }

  async dispatch<T>(type: JobType, data: T): Promise<void> {
    const job: Job<T> = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      data,
      createdAt: Date.now(),
    };

    logger.info(`[Queue] Dispatching background job ${job.type} (${job.id})`);

    // Asynchronously execute without blocking the main request thread
    setImmediate(async () => {
      const handler = this.handlers.get(type);
      if (handler) {
        try {
          await handler(data);
          logger.info(`[Queue] Completed background job ${job.type} (${job.id})`);
        } catch (err: any) {
          logger.error(`[Queue] Failed background job ${job.type} (${job.id})`, err);
        }
      }
    });
  }
}

export const queue = new BackgroundJobRunner();

// Register Default Handlers
queue.registerHandler('SEND_PUSH_NOTIFICATION', async (data: { userId: string; title: string; body: string }) => {
  logger.info(`[Push Service] Delivering notification to user ${data.userId}: "${data.title}"`);
});

queue.registerHandler('PROCESS_MEDIA', async (data: { mediaUrl: string; mimeType: string }) => {
  logger.info(`[Media Worker] Processing media optimization for ${data.mediaUrl}`);
});
