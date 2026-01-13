import type { Channel, PresenceChannel } from 'laravel-echo';

// Use InstanceType to handle generic Echo class
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EchoInstance = any;

export interface LiveWaveConfig {
  apiKey: string;
  host: string;
  port?: number;
  scheme?: 'ws' | 'wss';
  cluster?: string;
  authEndpoint?: string;
  authHeaders?: Record<string, string>;
  enableLogging?: boolean;
  forceTLS?: boolean;
}

export type ConnectionState = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'failed';

export interface LiveWaveContextValue {
  echo: EchoInstance | null;
  isConnected: boolean;
  connectionState: ConnectionState;
  connect: () => void;
  disconnect: () => void;
  config: LiveWaveConfig;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
  data?: Record<string, unknown>;
  action?: {
    text: string;
    url: string;
  };
  read: boolean;
  createdAt: Date;
}

export interface NotificationOptions {
  maxItems?: number;
  channel?: string;
  onNotification?: (notification: Notification) => void;
}

export interface PresenceMember<T = Record<string, unknown>> {
  id: string | number;
  info: T;
}

export interface PresenceChannelState<T = Record<string, unknown>> {
  channel: PresenceChannel | null;
  members: PresenceMember<T>[];
  me: PresenceMember<T> | null;
  subscribe: () => void;
  unsubscribe: () => void;
}

export type { Channel, PresenceChannel, EchoInstance as Echo };
