import { useLiveWave } from './useLiveWave';
import type { ConnectionState } from '../types';

interface UseConnectionStateReturn {
  state: ConnectionState;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  isReconnecting: boolean;
  isFailed: boolean;
}

export function useConnectionState(): UseConnectionStateReturn {
  const { connectionState } = useLiveWave();

  return {
    state: connectionState,
    isConnected: connectionState === 'connected',
    isConnecting: connectionState === 'connecting',
    isDisconnected: connectionState === 'disconnected',
    isReconnecting: connectionState === 'reconnecting',
    isFailed: connectionState === 'failed',
  };
}
