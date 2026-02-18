'use client';

import { useState } from 'react';
import { Sparkles, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { aiProductAdvisor, AiProductAdvisorOutput } from '@/ai/flows/ai-product-advisor';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function AiProductAdvisor() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiProductAdvisorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const output = await aiProductAdvisor({ userQuery: query });
      setResult(output);
    } catch (err) {
      setError('Hubo un error al contactar a nuestro asesor de IA. Por favor, intenta de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = (q: string) => {
    setQuery(q);
    // Submit immediately with the new query
    setLoading(true);
    aiProductAdvisor({ userQuery: q })
      .then(setResult)
      .catch(() => setError('Error al procesar la pregunta.'))
      .finally(() => setLoading(false));
  };

  return (
    <section id="ai-advisor" className="py-20 sm:py-32 bg-secondary/20">
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fadeIn opacity-0" style={{ animationDelay: '200ms' }}>
          <Card className="border-none shadow-2xl glass-card rounded-[2rem] overflow-hidden">
            <CardHeader className="text-center pt-12">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-6 animate-bounce">
                  <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Tu Guía de Bienestar</CardTitle>
              <CardDescription className="max-w-md mx-auto text-base text-gray-500 leading-relaxed">
                Nuestra Inteligencia Artificial analiza tu estado actual para recomendarte la experiencia que tu cuerpo y mente necesitan hoy.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-12">
              <form onSubmit={handleSubmit} className="relative group">
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ej: 'Me siento con mucha carga mental y tensión en el cuello'..."
                  className="min-h-[140px] bg-white/50 border-white/40 rounded-2xl p-6 text-lg focus:ring-primary/20 transition-all duration-300 group-hover:bg-white resize-none"
                  disabled={loading}
                />
                <Button 
                  type="submit" 
                  className="w-full mt-6 btn-primary h-14 text-base" 
                  disabled={loading || !query.trim()}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analizando tu energía...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Consultar Oráculo de IA
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              {loading && (
                  <div className="mt-12 space-y-6 animate-pulse">
                      <Skeleton className="h-10 w-2/3 rounded-lg" />
                      <Skeleton className="h-4 w-full rounded-full" />
                      <Skeleton className="h-4 w-5/6 rounded-full" />
                      <div className="pt-4">
                        <Skeleton className="h-8 w-1/3 rounded-lg mb-4" />
                        <Skeleton className="h-4 w-full rounded-full" />
                        <Skeleton className="h-4 w-3/4 rounded-full" />
                      </div>
                  </div>
              )}

              {error && (
                <div className="mt-8 p-4 rounded-xl bg-destructive/10 text-destructive text-center animate-scaleIn">
                  <p className="font-semibold">{error}</p>
                </div>
              )}

              {result && (
                <div className="mt-12 p-8 rounded-[1.5rem] bg-white shadow-sm border border-primary/10 animate-scaleIn">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-primary/70 uppercase mb-4">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Recomendación Personalizada
                  </div>
                  <h3 className="font-bold text-3xl text-gray-900 mb-2">{result.productName}</h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-secondary text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                    {result.productType}
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm tracking-widest uppercase mb-2">Descripción del Ritual</h4>
                      <p className="text-gray-600 leading-relaxed">{result.description}</p>
                    </div>
                    
                    <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
                      <h4 className="font-bold text-primary text-sm tracking-widest uppercase mb-2">Nuestra Intuición</h4>
                      <p className="text-gray-700 leading-relaxed italic">"{result.reasoning}"</p>
                    </div>

                    {result.suggestedNextQuestions && result.suggestedNextQuestions.length > 0 && (
                        <div className="pt-4">
                            <h4 className="font-bold text-gray-400 text-[10px] tracking-widest uppercase mb-4">¿Quieres profundizar más?</h4>
                            <div className="flex flex-col gap-2">
                                {result.suggestedNextQuestions.map((q, i) => (
                                    <button 
                                      key={i} 
                                      onClick={() => handleNextQuestion(q)}
                                      className="text-left p-4 text-sm font-medium text-gray-600 border border-gray-100 rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 flex justify-between items-center group/btn"
                                    >
                                        {q}
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
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
