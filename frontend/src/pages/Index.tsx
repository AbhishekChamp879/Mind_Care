import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OptimizedBackgroundImage } from '@/components/ui/optimized-image';
import Footer from '@/components/layout/Footer';
import heroImage from '@/assets/freepik__retouch__90823.png';
import {
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  Shield,
  Heart,
  CheckCircle,
  Globe,
  Zap,
  Star,
  ChevronDown,
  Award,
  TrendingUp,
  UserCheck,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  Quote,
  Play,
} from 'lucide-react';
import { useState, useEffect, ComponentType, SVGProps } from 'react';
import PageTransition from '@/components/ui/PageTransition';
import ScrollFadeIn from '@/components/ui/ScrollFadeIn';

// Animated Counter
const AnimatedCounter = ({
  end,
  duration = 2,
  suffix = '',
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

// Floating Particles
const FloatingParticles = () => {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <div
          key={i}
          className="absolute opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        >
          <div className="w-1 h-1 bg-primary rounded-full shadow-glow"></div>
        </div>
      ))}
    </div>
  );
};

// FAQ Item Component
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
  return (
    <div className={`enhanced-card ${isOpen ? 'border border-black rounded-lg' : 'border border-white rounded-lg'}`}>
      <button
        onClick={onClick}
        className="w-full p-6 text-left flex justify-between items-center hover:bg-muted/10 transition-colors duration-200"
      >
        <span className="font-medium text-lg pr-4">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-400 flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          isOpen ? 'max-h-40 p-5 opacity-100' : 'max-h-0 opacity-0 p-0'
        }`}
      >
        <div className="text-muted-foreground leading-relaxed border-t pt-4">{answer}</div>
      </div>
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  badge: string;
  features?: string[];
}

const FeatureCard = ({ icon: Icon, title, description, badge, features }: FeatureCardProps) => {
  return (
    <Card className="enhanced-card slide-up group hover:shadow-aurora transition-all duration-500">
      <CardHeader className="text-center relative">
        <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 w-fit group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <Badge
          variant="secondary"
          className="absolute top-4 right-4 text-xs bg-gradient-primary text-white"
        >
          {badge}
        </Badge>
        <CardTitle className="text-xl mb-3">{title}</CardTitle>
        <CardDescription className="text-center leading-relaxed">{description}</CardDescription>

        {features && (
          <div className="mt-4 space-y-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-center text-sm text-muted-foreground"
              >
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                {feature}
              </div>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <Button
          asChild
          variant="outline"
          className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-300"
        >
          <Link to="/login">
            Learn More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const testimonials = [
    {
      name: 'Anonymous',
      role: 'Computer Science Student',
      content:
        'MindBuddy helped me through my toughest semester. The AI chat was there when I needed it most at 3 AM during finals week.',
      rating: 5,
    },
    {
      name: 'Anonymous',
      role: 'Psychology Major',
      content:
        'The counseling sessions are incredibly professional and confidential. It removed the stigma I felt about seeking help.',
      rating: 5,
    },
    {
      name: 'Anonymous',
      role: 'Engineering Student',
      content:
        "The peer support forum connected me with others who understood what I was going through. I'm not alone anymore.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: 'Is MindBuddy completely confidential?',
      answer:
        'Absolutely. We adhere to strict HIPAA compliance standards. Your conversations are completely confidential.',
    },
    {
      question: 'How does the AI crisis detection work?',
      answer:
        'Our AI uses validated screening tools like PHQ-9 and GAD-7 to assess your responses. Crisis indicators connect you with emergency resources immediately.',
    },
    {
      question: 'Are the counselors real licensed professionals?',
      answer: 'Yes, all our counselors are licensed mental health professionals.',
    },
    {
      question: 'Is MindBuddy free for students?',
      answer:
        'We offer a comprehensive free tier with AI chat, basic resources, and forum access. Premium counseling may have costs but are often discounted for students.',
    },
    {
      question: 'Can I remain anonymous on the platform?',
      answer:
        'Yes, especially in our peer support forums. Basic info is collected for safety, but participation can be anonymous.',
    },
    {
      question: 'What if I am having a mental health emergency?',
      answer:
        "If in immediate danger, please call 911. MindBuddy provides immediate crisis resources and 24/7 crisis chat support.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <PageTransition>
      {/* Header */}
      <ScrollFadeIn yOffset={32}>
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                MindBuddy
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="default" className="bg-gradient-primary hover:shadow-glow ">
                <Link to="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </header>
      </ScrollFadeIn>

      {/* Hero Section */}
      <ScrollFadeIn yOffset={34} delay={0.03}>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8 sm:pt-28 lg:pt-32 sm:pb-24 lg:pb-28">
          <FloatingParticles />
          <OptimizedBackgroundImage
            src={heroImage}
            className="absolute inset-0 opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-20" />
          <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
            <Badge variant="secondary" className="animate-pulse bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-4 w-4 mr-2" />
              Trusted by 10,000+ Students
            </Badge>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              Your Mental Health <br />
              <span className="bg-gradient-aurora bg-clip-text text-transparent">Matters Most</span>
            </h1>
          </div>
        </section>
      </ScrollFadeIn>

      {/* FAQs */}
      <ScrollFadeIn yOffset={24} delay={0.16}>
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about MindBuddy's mental health support services.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </section>
      </ScrollFadeIn>

      <Footer />
    </PageTransition>
  );
};

export default Index;
