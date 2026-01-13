import { useEffect, useRef } from 'react';
import type { Channel } from '../types';

export function useEvent<T = unknown>(
  channel: Channel | null,
  eventName: string,
  callback: (data: T) => void
): void {
  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!channel || !eventName) {
      return;
    }

    const handler = (data: T) => {
      callbackRef.current(data);
    };

    // Listen for the event
    channel.listen(`.${eventName}`, handler);

    return () => {
      channel.stopListening(`.${eventName}`, handler);
    };
  }, [channel, eventName]);
}
