'use client';

import { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, ArrowRight, Loader2, Zap, Brain, Stars } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { aiProductAdvisor, AiProductAdvisorOutput } from '@/ai/flows/ai-product-advisor';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const THINKING_STEPS = [
  "Sintonizando tu energía...",
  "Consultando el oráculo de bienestar...",
  "Analizando frecuencias holísticas...",
  "Preparando tu ritual personalizado...",
];

export default function AiProductAdvisor() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [result, setResult] = useState<AiProductAdvisorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setThinkingStep((prev) => (prev + 1) % THINKING_STEPS.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Usamos un timeout manual por si la acción del servidor tarda demasiado en responder localmente
      const output = await aiProductAdvisor({ userQuery: query });
      setResult(output);
    } catch (err) {
      setError('Nuestros canales de IA están experimentando alta vibración. Por favor, intenta de nuevo en un momento.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = (q: string) => {
    setQuery(q);
    // Simular submit
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    setTimeout(() => handleSubmit(syntheticEvent), 100);
  };

  return (
    <section id="ai-advisor" className="py-20 sm:py-32 bg-secondary/20">
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fadeIn">
          <Card className="border-none shadow-2xl glass-card rounded-[2.5rem] overflow-hidden">
            <CardHeader className="text-center pt-12 pb-8">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-6 animate-pulse">
                  <Stars className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-4xl md:text-5xl font-bold mb-4 tracking-tight font-headline">Tu Guía de Bienestar</CardTitle>
              <CardDescription className="max-w-md mx-auto text-base text-gray-500 leading-relaxed font-body">
                Nuestra Inteligencia Artificial analiza tu estado actual para recomendarte la experiencia que tu cuerpo y mente necesitan hoy.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-12">
              <form onSubmit={handleSubmit} className="relative group space-y-6">
                <div className="relative">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ej: 'Me siento con mucha carga mental y tensión en el cuello'..."
                    className="min-h-[140px] bg-white/50 border-white/40 rounded-3xl p-6 text-lg focus:ring-primary/20 transition-all duration-300 group-hover:bg-white resize-none shadow-inner"
                    disabled={loading}
                  />
                  {!loading && query.trim() && (
                    <div className="absolute bottom-4 right-4 animate-bounce">
                      <Zap className="w-4 h-4 text-accent fill-accent" />
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-primary h-16 text-sm tracking-[0.2em]" 
                  disabled={loading || !query.trim()}
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {THINKING_STEPS[thinkingStep]}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Consultar Oráculo de IA
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </form>

              {loading && (
                  <div className="mt-12 space-y-6 animate-pulse">
                      <div className="flex items-center gap-3 mb-6">
                        <Brain className="w-5 h-5 text-primary/40 animate-pulse" />
                        <div className="h-2 w-24 bg-primary/10 rounded-full" />
                      </div>
                      <Skeleton className="h-10 w-2/3 rounded-2xl" />
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full rounded-full" />
                        <Skeleton className="h-4 w-5/6 rounded-full" />
                        <Skeleton className="h-4 w-4/6 rounded-full" />
                      </div>
                      <div className="pt-6">
                        <Skeleton className="h-32 w-full rounded-3xl" />
                      </div>
                  </div>
              )}

              {error && (
                <div className="mt-8 p-6 rounded-2xl bg-destructive/5 text-destructive border border-destructive/10 text-center animate-scaleIn flex flex-col items-center gap-2">
                  <div className="bg-destructive/10 p-2 rounded-full mb-2">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-sm tracking-wide uppercase">{error}</p>
                  <Button variant="link" onClick={() => handleSubmit()} className="text-destructive underline font-bold mt-2">
                    Reintentar conexión espiritual
                  </Button>
                </div>
              )}

              {result && (
                <div className="mt-12 p-8 rounded-[2rem] bg-white shadow-xl border border-primary/5 animate-scaleIn">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-primary/70 uppercase mb-6">
                    <Stars className="w-4 h-4 animate-spin-slow" />
                    Ritual Recomendado
                  </div>
                  
                  <h3 className="font-bold text-4xl text-gray-900 mb-2 font-headline">{result.productName}</h3>
                  <div className="inline-flex px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest mb-8 border border-primary/10">
                    {result.productType}
                  </div>
                  
                  <div className="space-y-8">
                    <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
                      <h4 className="font-bold text-gray-400 text-[10px] tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                        <div className="w-4 h-px bg-gray-200" />
                        Esencia del Ritual
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-lg">{result.description}</p>
                    </div>
                    
                    <div className="p-6 rounded-3xl bg-secondary/30 border border-white shadow-inner animate-fadeIn" style={{ animationDelay: '300ms' }}>
                      <h4 className="font-bold text-primary text-[10px] tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        Nuestra Intuición
                      </h4>
                      <p className="text-gray-700 leading-relaxed italic font-medium">"{result.reasoning}"</p>
                    </div>

                    {result.suggestedNextQuestions && result.suggestedNextQuestions.length > 0 && (
                        <div className="pt-4 animate-fadeIn" style={{ animationDelay: '500ms' }}>
                            <h4 className="font-bold text-gray-400 text-[10px] tracking-widest uppercase mb-4 text-center">Continúa tu exploración</h4>
                            <div className="flex flex-col gap-3">
                                {result.suggestedNextQuestions.map((q, i) => (
                                    <button 
                                      key={i} 
                                      onClick={() => handleNextQuestion(q)}
                                      className="text-left p-5 text-sm font-semibold text-gray-600 border border-gray-100 rounded-2xl hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-500 flex justify-between items-center group/btn shadow-sm"
                                    >
                                        {q}
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all text-primary" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-6 flex justify-center">
                        <Button asChild variant="outline" className="rounded-full px-8 h-12 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all font-bold tracking-widest text-[10px] uppercase">
                            <a href="/servicios">Ver Detalles en el Menú</a>
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

function XCircle(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}
