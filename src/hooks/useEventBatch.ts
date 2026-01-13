import { useCallback, useEffect, useRef, useState } from 'react';
import type { Channel } from '../types';

interface EventBatchOptions {
  debounce?: number;
  maxBatchSize?: number;
}

export function useEventBatch<T = unknown>(
  channel: Channel | null,
  eventNames: string[],
  options: EventBatchOptions = {}
): T[] {
  const { debounce = 100, maxBatchSize = 100 } = options;
  const [events, setEvents] = useState<T[]>([]);
  const batchRef = useRef<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const flush = useCallback(() => {
    if (batchRef.current.length > 0) {
      setEvents([...batchRef.current]);
      batchRef.current = [];
    }
  }, []);

  const addEvent = useCallback(
    (data: T) => {
      batchRef.current.push(data);

      if (batchRef.current.length >= maxBatchSize) {
        flush();
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(flush, debounce);
    },
    [debounce, maxBatchSize, flush]
  );

  useEffect(() => {
    if (!channel || eventNames.length === 0) {
      return;
    }

    const handlers: Array<{ event: string; handler: (data: T) => void }> = [];

    eventNames.forEach((eventName) => {
      const handler = (data: T) => addEvent(data);
      channel.listen(`.${eventName}`, handler);
      handlers.push({ event: eventName, handler });
    });

    return () => {
      handlers.forEach(({ event, handler }) => {
        channel.stopListening(`.${event}`, handler);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [channel, eventNames, addEvent]);

  return events;
}
