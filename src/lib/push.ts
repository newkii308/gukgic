import { queue } from '@/lib/queue';
import { logger } from '@/lib/logger';

interface PushNotificationPayload {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export const PushNotificationService = {
  async send(payload: PushNotificationPayload): Promise<void> {
    try {
      await queue.dispatch('SEND_PUSH_NOTIFICATION', payload);
    } catch (err: any) {
      logger.error('Failed to enqueue push notification', err, { userId: payload.userId });
    }
  },
};
