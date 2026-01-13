import { useCallback, useEffect, useState } from 'react';
import { useLiveWave } from './useLiveWave';
import type { PresenceChannel, PresenceMember, PresenceChannelState } from '../types';

export function usePresenceChannel<T = Record<string, unknown>>(
  channelName: string
): PresenceChannelState<T> {
  const { echo, isConnected } = useLiveWave();
  const [channel, setChannel] = useState<PresenceChannel | null>(null);
  const [members, setMembers] = useState<PresenceMember<T>[]>([]);
  const [me, setMe] = useState<PresenceMember<T> | null>(null);

  const subscribe = useCallback(() => {
    if (!echo || !isConnected || !channelName) {
      return;
    }

    const ch = echo.join(channelName)
      .here((users: PresenceMember<T>[]) => {
        setMembers(users);
      })
      .joining((user: PresenceMember<T>) => {
        setMembers((prev) => [...prev, user]);
      })
      .leaving((user: PresenceMember<T>) => {
        setMembers((prev) => prev.filter((m) => m.id !== user.id));
      })
      .error((error: Error) => {
        console.error('[LiveWave] Presence channel error:', error);
      });

    // Get current user from the channel
    if (ch.subscription?.members?.me) {
      setMe(ch.subscription.members.me as PresenceMember<T>);
    }

    setChannel(ch);
  }, [echo, isConnected, channelName]);

  const unsubscribe = useCallback(() => {
    if (echo && channelName) {
      echo.leave(`presence-${channelName}`);
      setChannel(null);
      setMembers([]);
      setMe(null);
    }
  }, [echo, channelName]);

  useEffect(() => {
    subscribe();

    return () => {
      unsubscribe();
    };
  }, [subscribe, unsubscribe]);

  return {
    channel,
    members,
    me,
    subscribe,
    unsubscribe,
  };
}
