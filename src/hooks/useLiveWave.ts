import { useContext } from 'react';
import { LiveWaveContext } from '../provider';
import type { LiveWaveContextValue } from '../types';

export function useLiveWave(): LiveWaveContextValue {
  const context = useContext(LiveWaveContext);

  if (!context) {
    throw new Error('useLiveWave must be used within a LiveWaveProvider');
  }

  return context;
}
