import { useEffect, useState } from 'react';
import { useLiveWave } from './useLiveWave';
import type { Channel } from '../types';

export function usePrivateChannel<T = unknown>(channelName: string): Channel | null {
  const { echo, isConnected } = useLiveWave();
  const [channel, setChannel] = useState<Channel | null>(null);

  useEffect(() => {
    if (!echo || !isConnected || !channelName) {
      return;
    }

    const ch = echo.private(channelName);
    setChannel(ch);

    return () => {
      echo.leave(`private-${channelName}`);
      setChannel(null);
    };
  }, [echo, isConnected, channelName]);

  return channel;
}
