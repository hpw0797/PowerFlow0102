
export enum PowerAction {
  SHUTDOWN = 'SHUTDOWN',
  RESTART = 'RESTART',
  SLEEP = 'SLEEP'
}

export interface ScheduledTask {
  id: string;
  type: 'POWER_OFF' | 'POWER_ON';
  time: string; // HH:mm format
  days: number[]; // 0-6 (Sun-Sat)
  enabled: boolean;
  force?: boolean;
  appsToLaunch?: string[];
}

export interface AppConfig {
  name: string;
  path: string;
  icon: string;
}
