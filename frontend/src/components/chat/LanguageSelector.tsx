import React from 'react'; // added import react and now this will run fine on localhost.
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Re-export from React
const { useState, useMemo } = React;

type RegionGroups = Record<string, Language[]>;

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  region?: string;
  isRTL?: boolean;
}

export const languages: Language[] = [
  // English
  { code: 'en', name: 'English', flag: '🇺🇸', region: 'Global', isRTL: false },

  // South Asian Languages
  { code: 'ur', name: 'اردو', flag: '🇵🇰', region: 'South Asia', isRTL: true },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', region: 'South Asia', isRTL: false },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩', region: 'South Asia', isRTL: false },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', region: 'South Asia', isRTL: false },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳', region: 'South Asia', isRTL: false },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳', region: 'South Asia', isRTL: false },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳', region: 'South Asia', isRTL: false },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'South Asia', isRTL: false },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳', region: 'South Asia', isRTL: false },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'South Asia', isRTL: false },

  // Middle Eastern Languages
  { code: 'ar', name: 'العربية', flag: '🇸🇦', region: 'Middle East', isRTL: true },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', region: 'Middle East', isRTL: true },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', region: 'Middle East', isRTL: false },

  // European Languages
  { code: 'es', name: 'Español', flag: '🇪🇸', region: 'Europe', isRTL: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'Europe', isRTL: false },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', region: 'Europe', isRTL: false },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', region: 'Europe', isRTL: false },
  { code: 'pt', name: 'Português', flag: '🇵🇹', region: 'Europe', isRTL: false },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', region: 'Europe', isRTL: false },

  // East Asian Languages
  { code: 'zh', name: '中文', flag: '🇨🇳', region: 'East Asia', isRTL: false },
  { code: 'ja', name: '日本語', flag: '🇯🇵', region: 'East Asia', isRTL: false },
  { code: 'ko', name: '한국어', flag: '🇰🇷', region: 'East Asia', isRTL: false },

  // Southeast Asian Languages
  { code: 'th', name: 'ไทย', flag: '🇹🇭', region: 'Southeast Asia', isRTL: false },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', region: 'Southeast Asia', isRTL: false },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Southeast Asia', isRTL: false },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾', region: 'Southeast Asia', isRTL: false },

  // African Languages
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', region: 'Africa', isRTL: false },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const currentLanguage = languages.find((lang) => lang.code === selectedLanguage);

  const filteredLanguages = useMemo(() => {
    return languages.filter((lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const groupedLanguages: RegionGroups = useMemo(() => {
    return filteredLanguages.reduce<RegionGroups>((groups, lang) => {
      const region = lang.region || 'Other';
      if (!groups[region]) {
        groups[region] = [];
      }
      groups[region].push(lang);
      return groups;
    }, {});
  }, [filteredLanguages]);

  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger
        className={cn(
          "w-56 bg-card/50 border-border/60 hover:border-primary/30 transition-colors shadow-soft backdrop-blur-sm",
          currentLanguage?.isRTL && "text-right"
        )}
      >
        <div className={cn(
          "flex items-center space-x-2",
          currentLanguage?.isRTL && "flex-row-reverse space-x-reverse"
        )}>
          <Globe className="h-4 w-4 text-primary flex-shrink-0" />
          <SelectValue>
            {currentLanguage ? (
              <span className={cn(
                "flex items-center space-x-2",
                currentLanguage.isRTL && "flex-row-reverse space-x-reverse"
              )}>
                <span className="text-base">{currentLanguage.flag}</span>
                <span className="text-sm font-medium">{currentLanguage.name}</span>
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">Select Language</span>
            )}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-80 w-56 bg-card/95 backdrop-blur-md border-border/60 shadow-elegant z-50">
        <div className="sticky top-0 p-2 bg-card/95 border-b border-border/60">
          <div className="flex items-center px-2 py-1 rounded-md bg-muted/50">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <Input
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground text-sm"
            />
          </div>
        </div>

        {(Object.keys(groupedLanguages) as Array<keyof RegionGroups>).map((region) => (
          <SelectGroup key={region}>
            <SelectLabel className="px-6 text-xs font-semibold text-muted-foreground">
              {region}
            </SelectLabel>
            {groupedLanguages[region].map((language: Language) => (
              <SelectItem
                key={language.code}
                value={language.code}
                className={cn(
                  "hover:bg-primary/10 focus:bg-primary/10 transition-colors",
                  language.isRTL && "text-right"
                )}
              >
                <div className={cn(
                  "flex items-center space-x-2",
                  language.isRTL && "flex-row-reverse space-x-reverse"
                )}>
                  <span className="text-lg">{language.flag}</span>
                  <span className="text-sm">{language.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
