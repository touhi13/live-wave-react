# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-13

### Added

- Initial release
- `LiveWaveProvider` - React context provider for WebSocket connections
- `useChannel` - Hook for subscribing to public channels
- `usePrivateChannel` - Hook for subscribing to private channels
- `usePresenceChannel` - Hook for subscribing to presence channels with member tracking
- `useEvent` - Hook for listening to events on channels
- `useEventBatch` - Hook for batching multiple events
- `useNotifications` - Hook for managing real-time notifications
- `useConnectionState` - Hook for monitoring connection state
- `useLiveWave` - Hook for accessing the LiveWave context
- `NotificationToast` - Component for displaying toast notifications
- `ConnectionStatus` - Component for displaying connection status
- Full TypeScript support with generics
- Laravel Echo and Pusher integration
