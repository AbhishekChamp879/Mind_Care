import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  Users,
  Wifi,
  WifiOff,
  Circle,
  Smile,
  Paperclip,
  MoreVertical,
  Volume2,
  VolumeX,
  Settings,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  ThumbsUp,
  Star,
  Zap,
  Signal,
  RadioIcon as Reconnecting,
} from 'lucide-react';

import {
  RealTimeConnection,
  ConnectionType,
  ConnectionStatus,
  ConnectionMessage,
  MessageType,
  ParticipantState,
  ConnectionFeature,
  PeerUser,
  generateAnonymousDisplayName,
  getStatusColor,
} from '@/types/peerMatching';

interface RealTimeConnectionSystemProps {
  currentUser?: PeerUser;
  connectionId?: string;
  connectionType?: ConnectionType;
  onConnectionEnd?: () => void;
  onMessageSent?: (message: ConnectionMessage) => void;
  className?: string;
}

// Mock WebSocket simulation
class MockWebSocket {
  private listeners: { [event: string]: ((data: any) => void)[] } = {};
  private connected = false;
  private connectionQuality = 100;

  constructor(private url: string) {
    // Simulate connection delay
    setTimeout(() => {
      this.connected = true;
      this.emit('open', { type: 'connection_established' });

      // Simulate periodic connection quality changes
      setInterval(() => {
        this.connectionQuality = Math.max(
          60,
          Math.min(100, this.connectionQuality + (Math.random() - 0.5) * 20)
        );
        this.emit('quality_update', { quality: this.connectionQuality });
      }, 5000);
    }, 1000);
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: (data: any) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
  }

  send(data: any) {
    if (this.connected) {
      // Simulate network delay
      setTimeout(
        () => {
          this.emit('message_sent', { ...data, timestamp: new Date().toISOString() });

          // Simulate incoming response for demo
          if (data.type === 'message' && Math.random() > 0.3) {
            setTimeout(
              () => {
                this.emit('message_received', {
                  id: `msg_${Date.now()}`,
                  senderId: 'peer_user',
                  content: this.generateResponse(data.content),
                  timestamp: new Date().toISOString(),
                  type: 'text',
                  isEncrypted: true,
                  readBy: [],
                  reactions: [],
                  attachments: [],
                });
              },
              1000 + Math.random() * 3000
            );
          }
        },
        100 + Math.random() * 200
      );
    }
  }

  private generateResponse(inputMessage: string): string {
    const responses = [
      "I understand how you're feeling. Can you tell me more about that?",
      "That sounds really challenging. You're not alone in this.",
      'Thank you for sharing that with me. How has that been affecting you?',
      "I've experienced something similar. Would you like to hear what helped me?",
      "That's a great insight. How do you think we can build on that?",
      'I appreciate you being so open. What would be most helpful right now?',
      "That resonates with me too. Let's explore some strategies together.",
      "You're showing a lot of strength by reaching out. What's your biggest concern right now?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  close() {
    this.connected = false;
    this.emit('close', { type: 'connection_closed' });
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  get readyState() {
    return this.connected ? 1 : 0; // 1 = OPEN, 0 = CONNECTING
  }
}

export const RealTimeConnectionSystem: React.FC<RealTimeConnectionSystemProps> = ({
  currentUser,
  connectionId = 'connection_123',
  connectionType = 'peer-buddy-chat',
  onConnectionEnd,
  onMessageSent,
  className = '',
}) => {
  // Connection state
  const [connection, setConnection] = useState<RealTimeConnection | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [connectionQuality, setConnectionQuality] = useState(100);
  const [messages, setMessages] = useState<ConnectionMessage[]>([]);
  const [participants, setParticipants] = useState<ParticipantState[]>([]);

  // UI state
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  // Refs
  const websocketRef = useRef<MockWebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock user data
  const user =
    currentUser ||
    ({
      id: 'user_123',
      anonymousId: 'anonymous_123',
      displayName: generateAnonymousDisplayName(),
      isOnline: true,
      lastActive: new Date().toISOString(),
    } as PeerUser);

  // Initialize connection
  useEffect(() => {
    const mockConnection: RealTimeConnection = {
      id: connectionId,
      participants: [user.id, 'peer_user_456'],
      type: connectionType,
      status: 'connecting',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      metadata: {
        priority: 'normal',
        duration: 0,
        participantStates: [
          {
            userId: user.id,
            status: 'online',
            lastSeen: new Date().toISOString(),
            isTyping: false,
            connectionQuality: 100,
            deviceType: 'desktop',
          },
          {
            userId: 'peer_user_456',
            status: 'online',
            lastSeen: new Date().toISOString(),
            isTyping: false,
            connectionQuality: 95,
            deviceType: 'mobile',
          },
        ],
        features: ['text-chat', 'voice-call', 'video-call', 'end-to-end-encryption'],
      },
      messages: [],
      isEncrypted: true,
      connectionQuality: 100,
    };

    setConnection(mockConnection);
    setParticipants(mockConnection.metadata.participantStates);

    // Initialize WebSocket
    const ws = new MockWebSocket(`wss://mindcare.com/peer-connection/${connectionId}`);
    websocketRef.current = ws;

    ws.on('open', () => {
      setConnectionStatus('connected');
      setTimeout(() => setConnectionStatus('active'), 1000);
    });

    ws.on('message_received', (message: ConnectionMessage) => {
      setMessages((prev) => [...prev, message]);
      setPeerTyping(false);
    });

    ws.on('typing_start', () => {
      setPeerTyping(true);
    });

    ws.on('typing_stop', () => {
      setPeerTyping(false);
    });

    ws.on('quality_update', (data: { quality: number }) => {
      setConnectionQuality(data.quality);
    });

    ws.on('close', () => {
      setConnectionStatus('disconnected');
    });

    return () => {
      ws.close();
    };
  }, [connectionId, connectionType, user.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicators
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      websocketRef.current?.send({ type: 'typing_start' });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      websocketRef.current?.send({ type: 'typing_stop' });
    }, 1000);
  }, [isTyping]);

  const sendMessage = () => {
    if (!newMessage.trim() || !websocketRef.current) return;

    const message: ConnectionMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      isEncrypted: true,
      readBy: [user.id],
      reactions: [],
      attachments: [],
    };

    setMessages((prev) => [...prev, message]);
    websocketRef.current.send({ type: 'message', ...message });
    onMessageSent?.(message);
    setNewMessage('');
    setIsTyping(false);
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(
            (r) => r.emoji === emoji && r.userId === user.id
          );
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.filter((r) => !(r.emoji === emoji && r.userId === user.id)),
            };
          } else {
            return {
              ...msg,
              reactions: [
                ...msg.reactions,
                {
                  emoji,
                  userId: user.id,
                  addedAt: new Date().toISOString(),
                },
              ],
            };
          }
        }
        return msg;
      })
    );
  };

  const endConnection = () => {
    websocketRef.current?.close();
    onConnectionEnd?.();
  };

  const getConnectionTypeIcon = (type: ConnectionType) => {
    switch (type) {
      case 'peer-buddy-chat':
        return <MessageCircle className="h-4 w-4" />;
      case 'study-group-session':
        return <Users className="h-4 w-4" />;
      case 'mentor-mentee-session':
        return <Star className="h-4 w-4" />;
      case 'one-on-one-call':
        return <Phone className="h-4 w-4" />;
      case 'group-video-call':
        return <Video className="h-4 w-4" />;
      case 'emergency-support':
        return <Heart className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getConnectionStatusIcon = (status: ConnectionStatus) => {
    switch (status) {
      case 'connecting':
        return <Reconnecting className="h-4 w-4 animate-pulse text-yellow-500" />;
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'active':
        return <Circle className="h-4 w-4 text-green-500 fill-current" />;
      case 'reconnecting':
        return <Reconnecting className="h-4 w-4 animate-pulse text-orange-500" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-500';
    if (quality >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ConnectionMessage) => {
    const isOwnMessage = message.senderId === user.id;
    const peer = participants.find((p) => p.userId === message.senderId);

    return (
      <div
        key={message.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-1' : 'order-2'}`}>
          {!isOwnMessage && (
            <div className="flex items-center space-x-2 mb-1">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {generateAnonymousDisplayName().substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">Anonymous Peer</span>
            </div>
          )}

          <div className={`group relative`}>
            <div
              className={`px-4 py-2 rounded-2xl ${
                isOwnMessage
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.isEncrypted && <Shield className="h-3 w-3 inline-block ml-2 opacity-50" />}
            </div>

            {/* Reactions */}
            {message.reactions.length > 0 && (
              <div className="flex space-x-1 mt-1">
                {message.reactions.map((reaction, index) => (
                  <button
                    key={index}
                    onClick={() => addReaction(message.id, reaction.emoji)}
                    className="text-xs bg-background border rounded-full px-2 py-1 hover:bg-accent"
                  >
                    {reaction.emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Quick reactions (on hover) */}
            <div className="absolute -top-8 right-0 hidden group-hover:flex space-x-1 bg-background border rounded-lg px-2 py-1">
              {['❤️', '👍', '😊', '🎯'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addReaction(message.id, emoji)}
                  className="hover:scale-110 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`flex items-center space-x-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
            {isOwnMessage && message.readBy.length > 1 && (
              <CheckCircle className="h-3 w-3 text-green-500" />
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!connection) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      {/* Header */}
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {getConnectionTypeIcon(connection.type)}
              <div>
                <CardTitle className="text-lg">
                  {connectionType.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  {getConnectionStatusIcon(connectionStatus)}
                  <span className="capitalize">{connectionStatus}</span>
                  {connectionStatus === 'active' && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <Signal className={`h-3 w-3 ${getQualityColor(connectionQuality)}`} />
                      <span className={`text-xs ${getQualityColor(connectionQuality)}`}>
                        {connectionQuality}%
                      </span>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Voice Controls */}
            <Button
              size="sm"
              variant={isMuted ? 'destructive' : 'outline'}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            {/* Video Controls */}
            <Button
              size="sm"
              variant={isVideoEnabled ? 'default' : 'outline'}
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            >
              <Video className="h-4 w-4" />
            </Button>

            {/* More Options */}
            <Button size="sm" variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>

            {/* End Connection */}
            <Button size="sm" variant="destructive" onClick={endConnection}>
              End
            </Button>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{participants.length} participants</span>
          </div>
          {connection.isEncrypted && (
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-green-500" />
              <span>End-to-end encrypted</span>
            </div>
          )}
        </div>
      </CardHeader>

      <Separator />

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Welcome Message */}
          <div className="text-center py-4">
            <div className="bg-muted/50 rounded-lg p-4 inline-block">
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Secure Connection Established</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your conversation is private and encrypted
              </p>
            </div>
          </div>

          {/* Messages */}
          {messages.map(renderMessage)}

          {/* Peer Typing Indicator */}
          {peerTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex items-center space-x-2 bg-muted rounded-full px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground">Peer is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Separator />

      {/* Message Input */}
      <div className="flex-shrink-0 p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Smile className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || connectionStatus !== 'active'}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Connection Status Footer */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Circle
              className={`h-2 w-2 ${connectionStatus === 'active' ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`}
            />
            <span>{connectionStatus === 'active' ? 'Connected securely' : 'Connecting...'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>
              {Math.floor((Date.now() - new Date(connection.createdAt).getTime()) / 60000)} min
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RealTimeConnectionSystem;
