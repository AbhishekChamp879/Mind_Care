import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { OptimizedImage } from '@/components/ui/optimized-image';
import heroImage from '@/assets/freepik__retouch__90823.png';
import { Shield, Heart, UserCheck, CheckCircle, Play } from 'lucide-react';
import { useEffect } from 'react';
import ScrollFadeIn from '@/components/ui/ScrollFadeIn';
import PageTransition from '@/components/ui/PageTransition';

const About = () => {
  useEffect(() => {
    // small client-side enhancement hook placeholder (e.g., could init Lottie later)
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="h-20" />

        <ScrollFadeIn yOffset={32}>
          <section className="relative py-20 md:py-28">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <Shield className="h-4 w-4 mr-2" />
                  Trusted & Secure
                </Badge>

                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                  About MindBuddy — Supporting Students, Saving Lives
                </h1>

                <p className="text-lg text-muted-foreground max-w-2xl">
                  Mental health crises among students are rising: increased anxiety, depression,
                  suicidal ideation, and barriers to timely care. MindBuddy combines AI screening,
                  licensed counselors, and peer support to reduce time-to-help, improve detection, and
                  deliver compassionate, confidential care.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-primary text-white px-8 py-3 rounded-full"
                  >
                    <Link to="/login">Get Support Now</Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-102 transition-transform duration-500">
                  <OptimizedImage
                    src={heroImage}
                    alt="Compassionate mental health care illustration depicting supportive healthcare professionals and individuals in a nurturing therapeutic environment"
                    className="w-full h-80 md:h-96 object-cover"
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  />
                </div>
                <div className="absolute -bottom-6 left-6 bg-white/6 backdrop-blur-md rounded-xl p-4 shadow-md flex items-center gap-3">
                  <Heart className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-sm text-white/90">Trusted by</div>
                    <div className="font-semibold text-lg">10,000+ students</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollFadeIn>

        <ScrollFadeIn yOffset={28} delay={0.05}>
          <section className="py-16 bg-gradient-calm">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold">Why this matters</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
                  Students face unique pressures — academic stress, social isolation, and limited access
                  to timely mental health care. Early detection and immediate support dramatically
                  improve outcomes.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="enhanced-card p-6 text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 w-fit">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Rapid Screening</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered PHQ/GAD screening in chat, available 24/7.
                  </p>
                </div>

                <div className="enhanced-card p-6 text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/30 w-fit">
                    <UserCheck className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">Licensed Care</h3>
                  <p className="text-sm text-muted-foreground">
                    Confidential sessions with vetted, licensed counselors.
                  </p>
                </div>

                <div className="enhanced-card p-6 text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-accent/20 to-accent/30 w-fit">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Privacy First</h3>
                  <p className="text-sm text-muted-foreground">
                    HIPAA-compliant systems and anonymized peer support options.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollFadeIn>

        <ScrollFadeIn yOffset={24} delay={0.08}>
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">How MindBuddy helps during a crisis</h2>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                        <Play className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="font-semibold">Immediate connection</div>
                        <div className="text-sm">
                          AI chat quickly triages and connects the user to resources or counselors when
                          warning signs are detected.
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                        <Heart className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="font-semibold">Warm handoffs</div>
                        <div className="text-sm">
                          When AI flags high risk, we initiate warm handoffs to licensed professionals
                          or emergency contacts.
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                        <Shield className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="font-semibold">Continuous monitoring</div>
                        <div className="text-sm">
                          Follow-ups and check-ins help prevent relapse and keep care plans on track.
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="enhanced-card p-6">
                    <h3 className="text-xl font-semibold mb-3">Real outcomes</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Early adopters report faster access to care and improved wellbeing metrics within
                      weeks of use.
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">78%</div>
                        <div className="text-xs text-muted-foreground">Improved wellbeing</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">24/7</div>
                        <div className="text-xs text-muted-foreground">Access to AI support</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">95%</div>
                        <div className="text-xs text-muted-foreground">Crisis detection accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollFadeIn>

        <ScrollFadeIn yOffset={24} delay={0.1}>
          <section className="py-16 bg-gradient-aurora text-white dark:bg-gradient-to-br dark:from-primary/20 dark:via-transparent dark:to-accent/10">
            <div className="container mx-auto text-center">
              <div className="max-w-3xl mx-auto space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold">Ready to learn more or get help?</h3>
                <p className="opacity-90">
                  We partner with universities to provide confidential, campus-tailored mental health
                  services.
                </p>
                <div className="flex justify-center gap-4">
                  <Button asChild className="text-white px-8 py-3 rounded-full">
                    <Link to="/login">Get Started</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </ScrollFadeIn>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default About;
