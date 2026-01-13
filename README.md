# LiveWave React SDK

Official React SDK for LiveWave real-time events and notifications platform.

## Installation

```bash
npm install @livewave/react
# or
yarn add @livewave/react
# or
pnpm add @livewave/react
```

## Quick Start

### 1. Configure the Provider

Wrap your app with the `LiveWaveProvider`:

```tsx
import { LiveWaveProvider } from '@livewave/react';

function App() {
  return (
    <LiveWaveProvider
      apiKey="your-api-key"
      host="your-livewave-host.com"
      port={6001}
      scheme="wss"
    >
      <YourApp />
    </LiveWaveProvider>
  );
}
```

### 2. Subscribe to Channels

```tsx
import { useChannel, useEvent } from '@livewave/react';

function ChatRoom({ roomId }) {
  const channel = useChannel(`chat-room.${roomId}`);
  
  useEvent(channel, 'new-message', (data) => {
    console.log('New message:', data);
  });

  return <div>Chat Room {roomId}</div>;
}
```

### 3. Use Presence Channels

```tsx
import { usePresenceChannel } from '@livewave/react';

function OnlineUsers({ roomId }) {
  const { members, me, subscribe, unsubscribe } = usePresenceChannel(
    `presence-room.${roomId}`
  );

  return (
    <div>
      <h3>Online Users ({members.length})</h3>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.info.name}
            {member.id === me?.id && ' (you)'}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 4. Handle Notifications

```tsx
import { useNotifications } from '@livewave/react';

function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div>
      <span>🔔 {unreadCount}</span>
      <ul>
        {notifications.map((notification) => (
          <li 
            key={notification.id}
            onClick={() => markAsRead(notification.id)}
          >
            {notification.title}
          </li>
        ))}
      </ul>
      <button onClick={markAllAsRead}>Mark all as read</button>
    </div>
  );
}
```

## API Reference

### Provider

```tsx
<LiveWaveProvider
  apiKey="string"           // Required: Your API key
  host="string"             // Required: WebSocket host
  port={number}             // Optional: WebSocket port (default: 6001)
  scheme="ws" | "wss"       // Optional: Protocol (default: "wss")
  cluster="string"          // Optional: Cluster name
  authEndpoint="string"     // Optional: Custom auth endpoint
  enableLogging={boolean}   // Optional: Enable debug logging
>
```

### Hooks

#### `useChannel(channelName: string)`

Subscribe to a public channel.

```tsx
const channel = useChannel('my-channel');
```

#### `usePrivateChannel(channelName: string)`

Subscribe to a private channel (requires authentication).

```tsx
const channel = usePrivateChannel('user.123');
```

#### `usePresenceChannel(channelName: string)`

Subscribe to a presence channel with member tracking.

```tsx
const { 
  channel,
  members,      // Array of current members
  me,           // Current user's member data
  subscribe,    // Function to manually subscribe
  unsubscribe   // Function to manually unsubscribe
} = usePresenceChannel('presence-room.1');
```

#### `useEvent(channel, eventName, callback)`

Listen for events on a channel.

```tsx
useEvent(channel, 'message', (data) => {
  console.log('Received:', data);
});
```

#### `useLiveWave()`

Access the LiveWave context directly.

```tsx
const { echo, isConnected, connectionState } = useLiveWave();
```

#### `useNotifications(options?)`

Manage real-time notifications.

```tsx
const {
  notifications,    // Array of notifications
  unreadCount,      // Number of unread notifications
  markAsRead,       // Function to mark single as read
  markAllAsRead,    // Function to mark all as read
  clearAll,         // Function to clear all notifications
} = useNotifications({
  maxItems: 50,     // Max notifications to keep
  channel: 'user.123.notifications', // Custom channel
});
```

### Components

#### `<NotificationToast />`

Display toast notifications automatically.

```tsx
import { NotificationToast } from '@livewave/react';

function App() {
  return (
    <LiveWaveProvider {...config}>
      <YourApp />
      <NotificationToast 
        position="top-right"
        duration={5000}
        maxToasts={5}
      />
    </LiveWaveProvider>
  );
}
```

#### `<ConnectionStatus />`

Display the connection status.

```tsx
import { ConnectionStatus } from '@livewave/react';

<ConnectionStatus 
  showWhenConnected={true}
  className="my-status"
/>
```

## TypeScript Support

Full TypeScript support with generics:

```tsx
interface Message {
  id: string;
  text: string;
  userId: number;
}

const channel = useChannel<Message>('chat');

useEvent<Message>(channel, 'new-message', (message) => {
  // message is typed as Message
  console.log(message.text);
});
```

## Advanced Usage

### Custom Authentication

```tsx
<LiveWaveProvider
  apiKey="your-key"
  host="your-host"
  authEndpoint="/api/broadcasting/auth"
  authHeaders={{
    'X-Custom-Header': 'value',
  }}
>
```

### Manual Connection Control

```tsx
function ConnectionManager() {
  const { connect, disconnect, isConnected } = useLiveWave();

  return (
    <div>
      <button onClick={connect} disabled={isConnected}>
        Connect
      </button>
      <button onClick={disconnect} disabled={!isConnected}>
        Disconnect
      </button>
    </div>
  );
}
```

### Event Batching

```tsx
import { useEventBatch } from '@livewave/react';

function Dashboard() {
  const events = useEventBatch(channel, ['event1', 'event2', 'event3'], {
    debounce: 100, // Batch events within 100ms
  });

  useEffect(() => {
    if (events.length > 0) {
      console.log('Received batch:', events);
    }
  }, [events]);
}
```

## License

MIT License
