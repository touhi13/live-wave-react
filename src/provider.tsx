import React, { createContext, useCallback, useEffect, useState, useMemo } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import type { LiveWaveConfig, LiveWaveContextValue, ConnectionState } from './types';

// Make Pusher available globally for Laravel Echo
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

export const LiveWaveContext = createContext<LiveWaveContextValue | null>(null);

interface LiveWaveProviderProps extends LiveWaveConfig {
  children: React.ReactNode;
}

export function LiveWaveProvider({
  children,
  apiKey,
  host,
  port = 6001,
  scheme = 'wss',
  cluster,
  authEndpoint = '/broadcasting/auth',
  authHeaders = {},
  enableLogging = false,
  forceTLS = true,
}: LiveWaveProviderProps) {
  const [echo, setEcho] = useState<Echo | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');

  const config: LiveWaveConfig = useMemo(() => ({
    apiKey,
    host,
    port,
    scheme,
    cluster,
    authEndpoint,
    authHeaders,
    enableLogging,
    forceTLS,
  }), [apiKey, host, port, scheme, cluster, authEndpoint, authHeaders, enableLogging, forceTLS]);

  const connect = useCallback(() => {
    if (echo) {
      return;
    }

    setConnectionState('connecting');

    try {
      const echoInstance = new Echo({
        broadcaster: 'reverb',
        key: apiKey,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: scheme === 'wss' || forceTLS,
        enabledTransports: ['ws', 'wss'],
        authEndpoint,
        auth: {
          headers: authHeaders,
        },
        enableLogging,
      });

      // Set up connection state listeners
      if (echoInstance.connector?.pusher) {
        const pusher = echoInstance.connector.pusher;

        pusher.connection.bind('connected', () => {
          setConnectionState('connected');
          if (enableLogging) {
            console.log('[LiveWave] Connected');
          }
        });

        pusher.connection.bind('disconnected', () => {
          setConnectionState('disconnected');
          if (enableLogging) {
            console.log('[LiveWave] Disconnected');
          }
        });

        pusher.connection.bind('connecting', () => {
          setConnectionState('connecting');
          if (enableLogging) {
            console.log('[LiveWave] Connecting...');
          }
        });

        pusher.connection.bind('reconnecting', () => {
          setConnectionState('reconnecting');
          if (enableLogging) {
            console.log('[LiveWave] Reconnecting...');
          }
        });

        pusher.connection.bind('failed', () => {
          setConnectionState('failed');
          if (enableLogging) {
            console.error('[LiveWave] Connection failed');
          }
        });
      }

      setEcho(echoInstance);
    } catch (error) {
      setConnectionState('failed');
      if (enableLogging) {
        console.error('[LiveWave] Connection error:', error);
      }
    }
  }, [echo, apiKey, host, port, scheme, authEndpoint, authHeaders, enableLogging, forceTLS]);

  const disconnect = useCallback(() => {
    if (echo) {
      echo.disconnect();
      setEcho(null);
      setConnectionState('disconnected');
    }
  }, [echo]);

  // Auto-connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value: LiveWaveContextValue = useMemo(() => ({
    echo,
    isConnected: connectionState === 'connected',
    connectionState,
    connect,
    disconnect,
    config,
  }), [echo, connectionState, connect, disconnect, config]);

  return (
    <LiveWaveContext.Provider value={value}>
      {children}
    </LiveWaveContext.Provider>
  );
}
