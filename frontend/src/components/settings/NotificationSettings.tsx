import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bell,
  Clock,
  Heart,
  Wind,
  Calendar,
  Quote,
  Volume2,
  VolumeX,
  Moon,
  Plus,
  Trash2,
  CheckCircle,
  Info,
  Settings,
} from 'lucide-react';
import notificationService from '@/services/notificationService';
import { NotificationPreferences } from '@/types/notifications';

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    notificationService.getPreferences()
  );
  const [hasPermission, setHasPermission] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  };

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === 'granted');
    }
  };

  const updatePreferences = (updates: Partial<NotificationPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    notificationService.savePreferences(updates);
  };

  const sendTestNotification = () => {
    if (hasPermission) {
      new Notification('🌟 Test Notification', {
        body: 'Great! Your wellness notifications are working perfectly.',
        icon: '/favicon.ico',
      });
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 3000);
    }
  };

  const addBreathingTime = () => {
    const newTime = '12:00'; // Default time
    const newTimes = [...preferences.breathingReminders.times, newTime];
    updatePreferences({
      breathingReminders: {
        ...preferences.breathingReminders,
        times: newTimes,
      },
    });
  };

  const removeBreathingTime = (index: number) => {
    const newTimes = preferences.breathingReminders.times.filter((_, i) => i !== index);
    updatePreferences({
      breathingReminders: {
        ...preferences.breathingReminders,
        times: newTimes,
      },
    });
  };

  const updateBreathingTime = (index: number, time: string) => {
    const newTimes = [...preferences.breathingReminders.times];
    newTimes[index] = time;
    updatePreferences({
      breathingReminders: {
        ...preferences.breathingReminders,
        times: newTimes,
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-heading">Wellness Notifications</h1>
            <div className="h-1 w-16 bg-gradient-primary rounded-full mx-auto mt-2"></div>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Customize your reminder preferences to support your mental wellness journey. Get gentle
          nudges for mood check-ins, breathing exercises, and session reminders.
        </p>
      </div>

      {/* Permission Alert */}
      {!hasPermission && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <Info className="h-4 w-4 text-orange-600 dark:text-orange-300" />
          <AlertDescription className="flex items-center justify-between text-sm">
            <span className="text-orange-700 dark:text-orange-100">
              Enable browser notifications to receive wellness reminders even when the app is
              closed.
            </span>
            <Button
              onClick={requestPermission}
              size="sm"
              variant="outline"
              className="text-orange-700 border-orange-300 hover:bg-orange-50 dark:text-orange-100 dark:border-orange-600 dark:hover:bg-orange-900/40"
            >
              Enable Notifications
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Test Notification */}
      {hasPermission && (
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Notifications Enabled</span>
              </div>
              <Button
                onClick={sendTestNotification}
                size="sm"
                variant="outline"
                className={testNotificationSent ? 'bg-green-100 border-green-300' : ''}
                disabled={testNotificationSent}
              >
                {testNotificationSent ? 'Sent!' : 'Send Test'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {/* Mood Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-pink-500" />
              <span>Mood Check-in Reminders</span>
            </CardTitle>
            <CardDescription>
              Regular reminders to log your mood and track your emotional wellness
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable mood reminders</Label>
              <Switch
                checked={preferences.moodReminders.enabled}
                onCheckedChange={(enabled) =>
                  updatePreferences({
                    moodReminders: { ...preferences.moodReminders, enabled },
                  })
                }
              />
            </div>

            {preferences.moodReminders.enabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select
                      value={preferences.moodReminders.frequency}
                      onValueChange={(frequency: any) =>
                        updatePreferences({
                          moodReminders: { ...preferences.moodReminders, frequency },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="twice-daily">Twice Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={preferences.moodReminders.time}
                      onChange={(e) =>
                        updatePreferences({
                          moodReminders: { ...preferences.moodReminders, time: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    📱 You'll receive gentle reminders like "🌟 How are you feeling today?" to help
                    you track your emotional patterns over time.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Breathing Exercise Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-blue-500" />
              <span>Breathing Exercise Reminders</span>
            </CardTitle>
            <CardDescription>
              Scheduled breathing exercises to help manage stress and anxiety throughout your day
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable breathing reminders</Label>
              <Switch
                checked={preferences.breathingReminders.enabled}
                onCheckedChange={(enabled) =>
                  updatePreferences({
                    breathingReminders: { ...preferences.breathingReminders, enabled },
                  })
                }
              />
            </div>

            {preferences.breathingReminders.enabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Exercise Duration</Label>
                    <Select
                      value={preferences.breathingReminders.duration.toString()}
                      onValueChange={(duration) =>
                        updatePreferences({
                          breathingReminders: {
                            ...preferences.breathingReminders,
                            duration: parseInt(duration),
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 minute</SelectItem>
                        <SelectItem value="3">3 minutes</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Reminder Times</Label>
                    <Button onClick={addBreathingTime} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Time
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {preferences.breathingReminders.times.map((time, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={time}
                          onChange={(e) => updateBreathingTime(index, e.target.value)}
                          className="flex-1"
                        />
                        {preferences.breathingReminders.times.length > 1 && (
                          <Button
                            onClick={() => removeBreathingTime(index)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    🧘‍♀️ Breathing exercises help reduce stress and improve focus. Try the 4-7-8
                    technique or box breathing for best results.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Session Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <span>Session Reminders</span>
            </CardTitle>
            <CardDescription>
              Reminders for your upcoming counseling sessions and follow-ups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable session reminders</Label>
              <Switch
                checked={preferences.sessionReminders.enabled}
                onCheckedChange={(enabled) =>
                  updatePreferences({
                    sessionReminders: { ...preferences.sessionReminders, enabled },
                  })
                }
              />
            </div>

            {preferences.sessionReminders.enabled && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Reminder time before session</Label>
                    <Select
                      value={preferences.sessionReminders.beforeSession.toString()}
                      onValueChange={(beforeSession) =>
                        updatePreferences({
                          sessionReminders: {
                            ...preferences.sessionReminders,
                            beforeSession: parseInt(beforeSession),
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes before</SelectItem>
                        <SelectItem value="10">10 minutes before</SelectItem>
                        <SelectItem value="15">15 minutes before</SelectItem>
                        <SelectItem value="30">30 minutes before</SelectItem>
                        <SelectItem value="60">1 hour before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Post-session follow-up</Label>
                    <Switch
                      checked={preferences.sessionReminders.followUp}
                      onCheckedChange={(followUp) =>
                        updatePreferences({
                          sessionReminders: { ...preferences.sessionReminders, followUp },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Reschedule reminders</Label>
                    <Switch
                      checked={preferences.sessionReminders.rescheduleReminder}
                      onCheckedChange={(rescheduleReminder) =>
                        updatePreferences({
                          sessionReminders: { ...preferences.sessionReminders, rescheduleReminder },
                        })
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Wellness Quotes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Quote className="h-5 w-5 text-purple-500" />
              <span>Daily Wellness Inspiration</span>
            </CardTitle>
            <CardDescription>
              Motivational quotes and wellness tips to brighten your day
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable wellness quotes</Label>
              <Switch
                checked={preferences.wellnessQuotes.enabled}
                onCheckedChange={(enabled) =>
                  updatePreferences({
                    wellnessQuotes: { ...preferences.wellnessQuotes, enabled },
                  })
                }
              />
            </div>

            {preferences.wellnessQuotes.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={preferences.wellnessQuotes.frequency}
                    onValueChange={(frequency: any) =>
                      updatePreferences({
                        wellnessQuotes: { ...preferences.wellnessQuotes, frequency },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={preferences.wellnessQuotes.time}
                    onChange={(e) =>
                      updatePreferences({
                        wellnessQuotes: { ...preferences.wellnessQuotes, time: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-500" />
              <span>General Settings</span>
            </CardTitle>
            <CardDescription>Sound, vibration, and quiet hours preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {preferences.general.sound ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
                <Label>Notification sound</Label>
              </div>
              <Switch
                checked={preferences.general.sound}
                onCheckedChange={(sound) =>
                  updatePreferences({
                    general: { ...preferences.general, sound },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Vibration (mobile devices)</Label>
              <Switch
                checked={preferences.general.vibration}
                onCheckedChange={(vibration) =>
                  updatePreferences({
                    general: { ...preferences.general, vibration },
                  })
                }
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4" />
                  <Label>Quiet hours</Label>
                </div>
                <Switch
                  checked={preferences.general.quietHours.enabled}
                  onCheckedChange={(enabled) =>
                    updatePreferences({
                      general: {
                        ...preferences.general,
                        quietHours: { ...preferences.general.quietHours, enabled },
                      },
                    })
                  }
                />
              </div>

              {preferences.general.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start time</Label>
                    <Input
                      type="time"
                      value={preferences.general.quietHours.start}
                      onChange={(e) =>
                        updatePreferences({
                          general: {
                            ...preferences.general,
                            quietHours: {
                              ...preferences.general.quietHours,
                              start: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End time</Label>
                    <Input
                      type="time"
                      value={preferences.general.quietHours.end}
                      onChange={(e) =>
                        updatePreferences({
                          general: {
                            ...preferences.general,
                            quietHours: {
                              ...preferences.general.quietHours,
                              end: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-heading">Your Wellness Schedule</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {preferences.moodReminders.enabled && (
                <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                  <Heart className="h-3 w-3 mr-1" />
                  Mood: {preferences.moodReminders.time}
                </Badge>
              )}
              {preferences.breathingReminders.enabled && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Wind className="h-3 w-3 mr-1" />
                  Breathing: {preferences.breathingReminders.times.length} times
                </Badge>
              )}
              {preferences.wellnessQuotes.enabled && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Quote className="h-3 w-3 mr-1" />
                  Quotes: {preferences.wellnessQuotes.time}
                </Badge>
              )}
              {preferences.sessionReminders.enabled && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Calendar className="h-3 w-3 mr-1" />
                  Sessions: {preferences.sessionReminders.beforeSession}min before
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Your personalized wellness notifications are designed to support your mental health
              journey
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
