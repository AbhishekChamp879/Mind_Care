import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Heart, MessageCircle, Clock, AlertTriangle, CheckCircle, Shield, Sparkles, Phone } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high' | 'crisis';
  suggestions?: string[];
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI response generator (simplified)
  const generateAIResponse = (userMessage: string): Message => {
    const lower = userMessage.toLowerCase();
    let severity: Message['severity'] = 'low';
    let response = 'Thanks for sharing. I am here to support you!';
    let suggestions: string[] = [
      "Tell me more",
      "Help me relax",
      "I need study tips",
    ];

    if (lower.includes('suicide') || lower.includes('kill myself')) {
      severity = 'crisis';
      response = `I'm very concerned. Please seek immediate help:
- Lifeline: 988
- Text HOME to 741741
- Campus Counseling`;
      suggestions = ['Connect me with crisis support'];
    } else if (lower.includes('panic') || lower.includes('breakdown')) {
      severity = 'high';
      response = `I hear you’re struggling. Take slow breaths and try grounding techniques.`;
      suggestions = ['Teach me breathing exercises'];
    } else if (lower.includes('anxious') || lower.includes('stressed')) {
      severity = 'medium';
      response = `It sounds stressful. Let's explore some coping strategies.`;
      suggestions = ['Help me manage stress'];
    }

    return { id: Date.now().toString(), text: response, sender: 'ai', timestamp: new Date(), severity, suggestions };
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: inputText, sender: 'user', timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'crisis': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-primary bg-primary/10';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'crisis': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Heart className="h-4 w-4 text-secondary" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Chat Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">MindBuddy AI Support</h1>
          <p className="text-muted-foreground">
            Your personal mental health companion, confidential & 24/7.
          </p>
          <div className="flex justify-center gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI-Powered</Badge>
            <Badge variant="outline" className="flex items-center gap-1"><Shield className="h-3 w-3" /> Confidential</Badge>
            <Badge variant="outline" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Crisis Detection</Badge>
          </div>
        </div>

        {/* Chat Card */}
        <Card className="mb-4">
          <CardHeader className="bg-gradient-to-r from-background to-background/80 p-4">
            <CardTitle>AI Mental Health Assistant</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg p-3 ${msg.sender === 'user' ? 'bg-primary/20 text-primary' : getSeverityColor(msg.severity)}`}>
                      {msg.sender === 'ai' && msg.severity && msg.severity !== 'low' && (
                        <div className="flex items-center space-x-1 mb-2">
                          {getSeverityIcon(msg.severity)}
                          <span className="text-xs">{msg.severity} priority</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                      {msg.suggestions && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {msg.suggestions.map((sug, i) => (
                            <Button key={i} variant="outline" size="sm" onClick={() => setInputText(sug)}>
                              {sug}
                            </Button>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start items-center space-x-2">
                    <Heart className="h-4 w-4 text-secondary animate-pulse" />
                    <span className="text-xs text-muted-foreground">MindBuddy is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex space-x-2 p-4 border-t border-border/40">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={!inputText.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Support */}
        <Card className="bg-red-50 border-red-200 p-4">
          <h3 className="font-bold text-red-800 mb-2">Emergency Support</h3>
          <p className="text-red-700 text-sm mb-4">
            If you are in crisis or having thoughts of self-harm, seek help immediately.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="destructive" className="flex items-center gap-2"><Phone /> Call 988</Button>
            <Button variant="outline" className="flex items-center gap-2"><MessageCircle /> Text HOME to 741741</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIChat;
