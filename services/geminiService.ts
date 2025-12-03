
import { Task, TaskType } from "../types";

export const generateDailyTasks = async (): Promise<Task[]> => {
  
  // Static Social Tasks with PKR rewards
  const socialTasks: Task[] = [
    {
      id: 'social-yt-1',
      title: 'Subscribe YouTube Channel',
      description: 'Subscribe to our official trading analysis channel.',
      reward: 50, // 50 PKR
      type: TaskType.SOCIAL,
      actionUrl: 'https://youtube.com', 
      isCompleted: false
    },
    {
      id: 'social-wa-1',
      title: 'Join WhatsApp Channel',
      description: 'Get daily trading signals and market updates.',
      reward: 50, // 50 PKR
      type: TaskType.SOCIAL,
      actionUrl: 'https://whatsapp.com/channel/0029Vb6GyLSLSmbZ97mZzF05',
      isCompleted: false
    }
  ];

  return socialTasks;
};
