import API_BASE_URL from './api';

export interface Notification {
  id: number;
  recipient_type: 'team' | 'participant';
  recipient_id: number;
  type: 'schedule' | 'result' | 'update';
  message: string;
  tournament_id?: number;
  match_id?: number;
  created_at: string;
  read: boolean;
}

export const NotificationService = {
  createNotification: async (notificationData: Omit<Notification, 'id' | 'created_at' | 'read'>): Promise<Notification> => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    });
    if (!response.ok) {
      throw new Error('Failed to create notification');
    }
    return response.json();
  },
}; 