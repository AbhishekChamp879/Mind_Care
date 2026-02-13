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
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sun,
  Moon,
  Monitor,
  Clock,
  BookOpen,
  Eye,
  Palette,
  MapPin,
  Sunrise,
  Sunset,
  Contrast,
  Type,
  Zap,
  Settings,
  Info,
  Check,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const EnhancedThemeSettings = () => {
  const {
    theme,
    actualTheme,
    setTheme,
    settings,
    updateSettings,
    readingMode,
    toggleReadingMode,
    isScheduledTime,
  } = useTheme();
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>(
    'prompt'
  );

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
      });
    }
  }, []);

  // Apply reduce-motion class if the user previously set it
  useEffect(() => {
    try {
      if (settings?.preferences?.reduceMotion) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    } catch (e) {
      // ignore (SSR)
    }
  }, [settings?.preferences?.reduceMotion]);

  const requestLocation = async () => {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        updateSettings({
          schedule: {
            ...settings.schedule,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          },
        });
        setLocationPermission('granted');
      } catch (error) {
        setLocationPermission('denied');
      }
    }
  };

  const previewColors = {
    default: '#3b82f6',
    emerald: '#10b981',
    rose: '#f43f5e',
    purple: '#8b5cf6',
    orange: '#f97316',
    teal: '#14b8a6',
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
            <Palette className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-heading">Enhanced Theme Settings</h1>
            <div className="h-1 w-16 bg-gradient-primary rounded-full mx-auto mt-2"></div>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Customize your visual experience with advanced theming options, auto-scheduling, and
          reading mode for optimal comfort.
        </p>
      </div>

      {/* Current Status */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {actualTheme === 'dark' ? (
                <Moon className="h-5 w-5 text-purple-600" />
              ) : (
                <Sun className="h-5 w-5 text-orange-600" />
              )}
              <div>
                <p className="font-medium">
                  Currently using <span className="capitalize">{actualTheme}</span> theme
                </p>
                {isScheduledTime && (
                  <p className="text-sm text-muted-foreground">Automatically scheduled</p>
                )}
              </div>
            </div>
            {readingMode && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <BookOpen className="h-3 w-3 mr-1" />
                Reading Mode Active
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="schedule">Auto-Schedule</TabsTrigger>
          <TabsTrigger value="reading">Reading Mode</TabsTrigger>
          <TabsTrigger value="wallpaper">Wallpaper</TabsTrigger>
        </TabsList>

        {/* Basic Theme Settings */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Theme Selection</span>
              </CardTitle>
              <CardDescription>
                Choose your preferred theme mode and visual preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'light', label: 'Light', icon: Sun, desc: 'Always light' },
                  { id: 'dark', label: 'Dark', icon: Moon, desc: 'Always dark' },
                  { id: 'system', label: 'System', icon: Monitor, desc: 'Follow system' },
                  { id: 'auto', label: 'Auto', icon: Clock, desc: 'Time-based' },
                ].map(({ id, label, icon: Icon, desc }) => (
                  <Card
                    key={id}
                    className={`cursor-pointer transition-all duration-200 ease-in-out border hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 ${
  theme === id
    ? 'border-primary ring-2 ring-primary/50 shadow-lg shadow-primary/40 bg-primary/5'
    : 'border-border shadow-md bg-background'
}`}
                    onClick={() => setTheme(id as any)}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <Icon className="h-6 w-6 mx-auto" />
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      {theme === id && <Check className="h-4 w-4 mx-auto text-primary" />}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Visual Preferences */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Visual Preferences
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>High Contrast</Label>
                      <p className="text-sm text-muted-foreground">
                        Enhanced contrast for better readability
                      </p>
                    </div>
                    <Switch
                      checked={settings.preferences.highContrast}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          preferences: { ...settings.preferences, highContrast: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Reduce Blue Light</Label>
                      <p className="text-sm text-muted-foreground">Warmer colors for evening use</p>
                    </div>
                    <Switch
                      checked={settings.preferences.reduceBlueLight}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          preferences: { ...settings.preferences, reduceBlueLight: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Smooth Transitions</Label>
                      <p className="text-sm text-muted-foreground">Animated theme changes</p>
                    </div>
                    <Switch
                      checked={settings.preferences.smoothTransitions}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          preferences: { ...settings.preferences, smoothTransitions: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Respect reduced motion</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce animations and motion to respect system accessibility settings
                      </p>
                    </div>
                    <Switch
                      checked={settings.preferences.reduceMotion || false}
                      onCheckedChange={(checked) => {
                        updateSettings({
                          preferences: { ...settings.preferences, reduceMotion: checked },
                        });

                        try {
                          if (checked) {
                            document.documentElement.classList.add('reduce-motion');
                          } else {
                            document.documentElement.classList.remove('reduce-motion');
                          }
                        } catch (e) {
                          // server-side rendering guard
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Accent Color */}
              <div className="space-y-4">
                <h4 className="font-medium">Custom Accent Color</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {Object.entries(previewColors).map(([name, color]) => (
                    <button
                      key={name}
                      className={`w-full h-10 rounded-lg border-2 transition-all ${
                        settings.preferences.customAccentColor === color
                          ? 'border-gray-400 scale-110'
                          : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        updateSettings({
                          preferences: { ...settings.preferences, customAccentColor: color },
                        })
                      }
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={settings.preferences.customAccentColor || '#3b82f6'}
                  onChange={(e) =>
                    updateSettings({
                      preferences: { ...settings.preferences, customAccentColor: e.target.value },
                    })
                  }
                  className="w-full h-12"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auto-Schedule Settings */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Automatic Dark Mode Scheduling</span>
              </CardTitle>
              <CardDescription>
                Automatically switch to dark mode during specific hours or based on sunrise/sunset
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Auto-Schedule</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically switch to dark mode at specified times
                  </p>
                </div>
                <Switch
                  checked={settings.schedule.enabled}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      schedule: { ...settings.schedule, enabled: checked },
                    })
                  }
                />
              </div>

              {settings.schedule.enabled && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Use Sunrise/Sunset</Label>
                      <p className="text-sm text-muted-foreground">
                        Calculate times based on your location
                      </p>
                    </div>
                    <Switch
                      checked={settings.schedule.useSunrise}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          schedule: { ...settings.schedule, useSunrise: checked },
                        })
                      }
                    />
                  </div>

                  {settings.schedule.useSunrise ? (
                    <div className="space-y-4">
                      <Alert>
                        <MapPin className="h-4 w-4" />
                        <AlertDescription>
                          {settings.schedule.location ? (
                            <div className="flex items-center justify-between">
                              <span>Location access granted for sunrise/sunset calculation</span>
                              <Badge variant="outline" className="text-green-600">
                                <Check className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span>Location access needed for sunrise/sunset times</span>
                              <Button onClick={requestLocation} size="sm">
                                Enable Location
                              </Button>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center">
                          <Sunset className="h-4 w-4 mr-2" />
                          Dark Mode Start
                        </Label>
                        <Input
                          type="time"
                          value={settings.schedule.darkModeStart}
                          onChange={(e) =>
                            updateSettings({
                              schedule: { ...settings.schedule, darkModeStart: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center">
                          <Sunrise className="h-4 w-4 mr-2" />
                          Dark Mode End
                        </Label>
                        <Input
                          type="time"
                          value={settings.schedule.darkModeEnd}
                          onChange={(e) =>
                            updateSettings({
                              schedule: { ...settings.schedule, darkModeEnd: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {isScheduledTime && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        Dark mode is currently active due to your schedule settings.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reading Mode Settings */}
        <TabsContent value="reading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Reading Mode</span>
              </CardTitle>
              <CardDescription>
                Optimize text display for comfortable reading and reduced eye strain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Reading Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enhanced typography and comfortable colors for long reading sessions
                  </p>
                </div>
                <Switch checked={readingMode} onCheckedChange={toggleReadingMode} />
              </div>

              {readingMode && (
                <div className="space-y-6">
                  {/* Typography Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center">
                      <Type className="h-4 w-4 mr-2" />
                      Typography
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <Select
                          value={settings.readingMode.fontSize}
                          onValueChange={(value: any) =>
                            updateSettings({
                              readingMode: { ...settings.readingMode, fontSize: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small (14px)</SelectItem>
                            <SelectItem value="medium">Medium (16px)</SelectItem>
                            <SelectItem value="large">Large (18px)</SelectItem>
                            <SelectItem value="extra-large">Extra Large (20px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Line Height</Label>
                        <Select
                          value={settings.readingMode.lineHeight}
                          onValueChange={(value: any) =>
                            updateSettings({
                              readingMode: { ...settings.readingMode, lineHeight: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal (1.5)</SelectItem>
                            <SelectItem value="relaxed">Relaxed (1.7)</SelectItem>
                            <SelectItem value="loose">Loose (2.0)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Font Family</Label>
                        <Select
                          value={settings.readingMode.fontFamily}
                          onValueChange={(value: any) =>
                            updateSettings({
                              readingMode: { ...settings.readingMode, fontFamily: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default (Sans-serif)</SelectItem>
                            <SelectItem value="serif">Serif (Georgia)</SelectItem>
                            <SelectItem value="mono">Monospace</SelectItem>
                            <SelectItem value="dyslexic">Dyslexic-friendly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Background</Label>
                        <Select
                          value={settings.readingMode.backgroundColor}
                          onValueChange={(value: any) =>
                            updateSettings({
                              readingMode: { ...settings.readingMode, backgroundColor: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="sepia">Sepia</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {settings.readingMode.backgroundColor === 'custom' && (
                      <div className="space-y-2">
                        <Label>Custom Background Color</Label>
                        <Input
                          type="color"
                          value={settings.readingMode.customBackground || '#ffffff'}
                          onChange={(e) =>
                            updateSettings({
                              readingMode: {
                                ...settings.readingMode,
                                customBackground: e.target.value,
                              },
                            })
                          }
                          className="w-full h-12"
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Comfort Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Comfort Options
                    </h4>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>High Contrast</Label>
                          <p className="text-sm text-muted-foreground">
                            Enhanced contrast for better readability
                          </p>
                        </div>
                        <Switch
                          checked={settings.readingMode.contrast === 'high'}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              readingMode: {
                                ...settings.readingMode,
                                contrast: checked ? 'high' : 'normal',
                              },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Warm Colors</Label>
                          <p className="text-sm text-muted-foreground">
                            Reduce blue light for evening reading
                          </p>
                        </div>
                        <Switch
                          checked={settings.readingMode.warmColors}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              readingMode: { ...settings.readingMode, warmColors: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Reduced Motion</Label>
                          <p className="text-sm text-muted-foreground">
                            Minimize animations and transitions
                          </p>
                        </div>
                        <Switch
                          checked={settings.readingMode.reducedMotion}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              readingMode: { ...settings.readingMode, reducedMotion: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          {readingMode && (
            <Card className="reading-mode-preview">
              <CardHeader>
                <CardTitle>Reading Mode Preview</CardTitle>
                <CardDescription>See how your reading settings will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <h3>Mental Health and Wellbeing</h3>
                  <p>
                    Mental health is just as important as physical health. It affects how we think,
                    feel, and act. It also helps determine how we handle stress, relate to others,
                    and make choices. Mental health is important at every stage of life, from
                    childhood and adolescence through adulthood.
                  </p>
                  <p>
                    Taking care of your mental health is an ongoing process. It involves developing
                    healthy coping strategies, building strong relationships, and seeking support
                    when needed. Remember, it's okay to not be okay, and reaching out for help is a
                    sign of strength, not weakness.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Dynamic Wallpaper Settings */}
        <TabsContent value="wallpaper" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Dynamic Wallpaper</span>
              </CardTitle>
              <CardDescription>
                Customize your background with dynamic gradients or images that change with your theme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Dynamic Wallpaper</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically change background based on theme
                  </p>
                </div>
                <Switch
                  checked={settings.wallpaper.enabled}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      wallpaper: { ...settings.wallpaper, enabled: checked },
                    })
                  }
                />
              </div>

              {settings.wallpaper.enabled && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Wallpaper Type</Label>
                    <Select
                      value={settings.wallpaper.type}
                      onValueChange={(value: 'gradient' | 'image') =>
                        updateSettings({
                          wallpaper: { ...settings.wallpaper, type: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gradient">Gradient</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {settings.wallpaper.type === 'gradient' ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label>Light Theme Gradient</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>From Color</Label>
                            <Input
                              type="color"
                              value={settings.wallpaper.light.gradient?.from || '#fde68a'}
                              onChange={(e) =>
                                updateSettings({
                                  wallpaper: {
                                    ...settings.wallpaper,
                                    light: {
                                      ...settings.wallpaper.light,
                                      gradient: {
                                        ...settings.wallpaper.light.gradient,
                                        from: e.target.value,
                                      },
                                    },
                                  },
                                })
                              }
                              className="w-full h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>To Color</Label>
                            <Input
                              type="color"
                              value={settings.wallpaper.light.gradient?.to || '#93c5fd'}
                              onChange={(e) =>
                                updateSettings({
                                  wallpaper: {
                                    ...settings.wallpaper,
                                    light: {
                                      ...settings.wallpaper.light,
                                      gradient: {
                                        ...settings.wallpaper.light.gradient,
                                        to: e.target.value,
                                      },
                                    },
                                  },
                                })
                              }
                              className="w-full h-12"
                            />
                          </div>
                        </div>
                        <div
                          className="h-24 rounded-lg transition-all"
                          style={{
                            background: `linear-gradient(to right, ${
                              settings.wallpaper.light.gradient?.from || '#fde68a'
                            }, ${settings.wallpaper.light.gradient?.to || '#93c5fd'})`,
                          }}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Dark Theme Gradient</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>From Color</Label>
                            <Input
                              type="color"
                              value={settings.wallpaper.dark.gradient?.from || '#0f172a'}
                              onChange={(e) =>
                                updateSettings({
                                  wallpaper: {
                                    ...settings.wallpaper,
                                    dark: {
                                      ...settings.wallpaper.dark,
                                      gradient: {
                                        ...settings.wallpaper.dark.gradient,
                                        from: e.target.value,
                                      },
                                    },
                                  },
                                })
                              }
                              className="w-full h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>To Color</Label>
                            <Input
                              type="color"
                              value={settings.wallpaper.dark.gradient?.to || '#1e293b'}
                              onChange={(e) =>
                                updateSettings({
                                  wallpaper: {
                                    ...settings.wallpaper,
                                    dark: {
                                      ...settings.wallpaper.dark,
                                      gradient: {
                                        ...settings.wallpaper.dark.gradient,
                                        to: e.target.value,
                                      },
                                    },
                                  },
                                })
                              }
                              className="w-full h-12"
                            />
                          </div>
                        </div>
                        <div
                          className="h-24 rounded-lg transition-all"
                          style={{
                            background: `linear-gradient(to right, ${
                              settings.wallpaper.dark.gradient?.from || '#0f172a'
                            }, ${settings.wallpaper.dark.gradient?.to || '#1e293b'})`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label>Light Theme Image</Label>
                        <Input
                          type="url"
                          placeholder="Enter image URL for light theme"
                          value={settings.wallpaper.light.imageUrl || ''}
                          onChange={(e) =>
                            updateSettings({
                              wallpaper: {
                                ...settings.wallpaper,
                                light: {
                                  ...settings.wallpaper.light,
                                  imageUrl: e.target.value,
                                },
                              },
                            })
                          }
                        />
                        {settings.wallpaper.light.imageUrl && (
                          <div
                            className="h-48 rounded-lg bg-cover bg-center transition-all"
                            style={{
                              backgroundImage: `url(${settings.wallpaper.light.imageUrl})`,
                            }}
                          />
                        )}
                      </div>

                      <div className="space-y-4">
                        <Label>Dark Theme Image</Label>
                        <Input
                          type="url"
                          placeholder="Enter image URL for dark theme"
                          value={settings.wallpaper.dark.imageUrl || ''}
                          onChange={(e) =>
                            updateSettings({
                              wallpaper: {
                                ...settings.wallpaper,
                                dark: {
                                  ...settings.wallpaper.dark,
                                  imageUrl: e.target.value,
                                },
                              },
                            })
                          }
                        />
                        {settings.wallpaper.dark.imageUrl && (
                          <div
                            className="h-48 rounded-lg bg-cover bg-center transition-all"
                            style={{
                              backgroundImage: `url(${settings.wallpaper.dark.imageUrl})`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Changes will be applied immediately. The wallpaper will update automatically when
                      switching between light and dark themes.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedThemeSettings;
