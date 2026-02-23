'use client';

import { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, ArrowRight, Loader2, Brain, Stars, Sparkle, Wind, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { aiProductAdvisor, AiProductAdvisorOutput } from '@/ai/flows/ai-product-advisor';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/LanguageContext';

export default function AiProductAdvisor() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [result, setResult] = useState<AiProductAdvisorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const THINKING_STEPS = language === 'es' ? [
    "Sintonizando tu energía corporal...",
    "Consultando el oráculo de bienestar...",
    "Analizando frecuencias holísticas...",
    "Preparando tu ritual personalizado...",
  ] : [
    "Tuning your body's energy...",
    "Consulting the wellness oracle...",
    "Analyzing holistic frequencies...",
    "Preparing your personalized ritual...",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setThinkingStep((prev) => (prev + 1) % THINKING_STEPS.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading, THINKING_STEPS.length]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const output = await aiProductAdvisor({ 
        userQuery: query,
        language: language 
      });
      setResult(output);
    } catch (err) {
      setError(t('ai.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = (q: string) => {
    setQuery(q);
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    setTimeout(() => handleSubmit(syntheticEvent), 100);
  };

  return (
    <section id="ai-advisor" className="py-20 sm:py-32 bg-secondary/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="animate-fadeIn">
          <Card className="border-none shadow-[0_32px_64px_-16px_rgba(41,102,84,0.15)] glass-card rounded-[3rem] overflow-hidden border border-white/40">
            <CardHeader className="text-center pt-16 pb-10">
              <div className="mx-auto bg-primary/10 rounded-full p-5 w-fit mb-8 relative group">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping group-hover:animate-none opacity-40" />
                  <Stars className="w-10 h-10 text-primary relative z-10 animate-spin-slow" />
              </div>
              <CardTitle className="text-5xl md:text-6xl font-bold mb-6 tracking-tight font-headline text-gray-900">{t('ai.title')}</CardTitle>
              <CardDescription className="max-w-md mx-auto text-lg text-gray-500 leading-relaxed font-body italic">
                "{t('ai.desc')}"
              </CardDescription>
            </CardHeader>
            <CardContent className="px-10 pb-16">
              <form onSubmit={handleSubmit} className="relative group space-y-8">
                <div className="relative">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('ai.placeholder')}
                    className="min-h-[160px] bg-white/40 border-white/60 rounded-[2.5rem] p-8 text-xl focus:ring-primary/10 transition-all duration-500 group-hover:bg-white/80 resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-sm"
                    disabled={loading}
                  />
                  {!loading && query.trim() && (
                    <div className="absolute bottom-6 right-8 animate-bounce">
                      <Sparkle className="w-5 h-5 text-accent fill-accent" />
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-primary h-20 text-base tracking-[0.25em] shadow-xl group/btn" 
                  disabled={loading || !query.trim()}
                >
                  {loading ? (
                    <span className="flex items-center gap-4">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      {THINKING_STEPS[thinkingStep]}
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      {t('ai.cta')}
                      <Wind className="w-6 h-6 transition-transform group-hover/btn:translate-x-2" />
                    </span>
                  )}
                </Button>
              </form>

              {loading && (
                  <div className="mt-16 space-y-8 animate-pulse">
                      <div className="flex items-center gap-4 mb-8">
                        <Brain className="w-6 h-6 text-primary/30 animate-pulse" />
                        <div className="h-1.5 w-32 bg-primary/10 rounded-full" />
                      </div>
                      <Skeleton className="h-12 w-3/4 rounded-3xl" />
                      <div className="space-y-4">
                        <Skeleton className="h-5 w-full rounded-full" />
                        <Skeleton className="h-5 w-11/12 rounded-full" />
                        <Skeleton className="h-5 w-10/12 rounded-full" />
                      </div>
                  </div>
              )}

              {error && (
                <div className="mt-12 p-10 rounded-[2.5rem] bg-destructive/5 text-destructive border border-destructive/10 text-center animate-scaleIn flex flex-col items-center gap-4">
                  <XCircle className="w-8 h-8" />
                  <p className="font-bold text-lg tracking-wide uppercase">{error}</p>
                </div>
              )}

              {result && (
                <div className="mt-16 p-10 rounded-[3rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-primary/5 animate-scaleIn">
                  <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.4em] text-primary/60 uppercase mb-8">
                    <Stars className="w-5 h-5 animate-spin-slow text-accent" />
                    {t('ai.ritual')}
                  </div>
                  
                  <h3 className="font-bold text-5xl md:text-6xl text-gray-900 mb-4 font-headline leading-tight">{result.productName}</h3>
                  <div className="inline-flex px-6 py-2 rounded-full bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-[0.2em] mb-10 border border-primary/10">
                    {result.productType}
                  </div>
                  
                  <div className="space-y-12">
                    <div>
                      <h4 className="font-bold text-gray-400 text-[11px] tracking-[0.3em] uppercase mb-5 flex items-center gap-3">
                        <div className="w-6 h-px bg-gray-200" />
                        {t('ai.purpose')}
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-xl font-light">{result.description}</p>
                    </div>
                    
                    <div className="p-8 rounded-[2.5rem] bg-secondary/40 border border-white shadow-[inset_0_2px_10px_rgba(41,102,84,0.05)]">
                      <h4 className="font-bold text-primary text-[11px] tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
                        <MessageSquare className="w-4 h-4" />
                        {t('ai.intuition')}
                      </h4>
                      <p className="text-gray-800 leading-relaxed italic font-medium text-lg">"{result.reasoning}"</p>
                    </div>

                    {result.suggestedNextQuestions && result.suggestedNextQuestions.length > 0 && (
                        <div className="pt-8">
                            <h4 className="font-bold text-gray-400 text-[11px] tracking-[0.3em] uppercase mb-6 text-center">{t('ai.next')}</h4>
                            <div className="flex flex-col gap-4">
                                {result.suggestedNextQuestions.map((q, i) => (
                                    <button 
                                      key={i} 
                                      onClick={() => handleNextQuestion(q)}
                                      className="text-left p-6 text-base font-semibold text-gray-600 border border-gray-100/60 rounded-[1.75rem] hover:border-primary/30 hover:bg-white hover:text-primary transition-all duration-500 flex justify-between items-center group/btn shadow-sm hover:shadow-md"
                                    >
                                        {q}
                                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-3 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all text-primary" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-10 flex justify-center">
                        <Button asChild variant="outline" className="rounded-full px-12 h-14 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-500 font-bold tracking-[0.2em] text-[11px] uppercase shadow-lg">
                            <Link href="/servicios">{t('ai.menuCta')}</Link>
                        </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
