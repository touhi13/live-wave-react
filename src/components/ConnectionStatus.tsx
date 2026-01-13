import React from 'react';
import { useConnectionState } from '../hooks/useConnectionState';
import type { ConnectionState } from '../types';

interface ConnectionStatusProps {
  showWhenConnected?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ConnectionStatus({
  showWhenConnected = false,
  className,
  style,
}: ConnectionStatusProps) {
  const { state, isConnected } = useConnectionState();

  if (isConnected && !showWhenConnected) {
    return null;
  }

  const stateConfig: Record<ConnectionState, { color: string; label: string }> = {
    connected: { color: '#22c55e', label: 'Connected' },
    connecting: { color: '#f59e0b', label: 'Connecting...' },
    reconnecting: { color: '#f59e0b', label: 'Reconnecting...' },
    disconnected: { color: '#6b7280', label: 'Disconnected' },
    failed: { color: '#ef4444', label: 'Connection failed' },
  };

  const config = stateConfig[state];

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: `${config.color}20`,
        color: config.color,
        ...style,
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: config.color,
          animation: state === 'connecting' || state === 'reconnecting' 
            ? 'pulse 1.5s infinite' 
            : 'none',
        }}
      />
      {config.label}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}
