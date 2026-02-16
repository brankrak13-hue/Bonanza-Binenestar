'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { aiProductAdvisor, AiProductAdvisorOutput } from '@/ai/flows/ai-product-advisor';
import { Skeleton } from '@/components/ui/skeleton';

export default function AiProductAdvisor() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiProductAdvisorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <section id="ai-advisor" className="py-16 sm:py-24 bg-secondary/30">
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Asesor de IA Personalizado</CardTitle>
            <CardDescription className="max-w-lg mx-auto">
              ¿No sabes qué tratamiento es el mejor para ti? Describe lo que buscas o cómo te sientes, y nuestra IA te recomendará la experiencia perfecta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: 'Me siento muy estresado y con dolor de espalda' o 'Quiero un tratamiento facial para rejuvenecer la piel'"
                className="min-h-[100px] bg-white"
                disabled={loading}
              />
              <Button type="submit" className="w-full btn-primary" disabled={loading}>
                {loading ? 'Pensando...' : 'Obtener Recomendación'}
              </Button>
            </form>

            {loading && (
                <div className="mt-6 space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                     <Skeleton className="h-6 w-1/3 mt-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            )}

            {error && (
              <div className="mt-6 text-center text-destructive">
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-6 p-4 border rounded-lg bg-white">
                <h3 className="font-bold text-xl text-primary">{result.productName}</h3>
                <p className="font-semibold capitalize text-sm text-muted-foreground mb-2">{result.productType}</p>
                <p className="text-foreground/80 mb-4">{result.description}</p>
                <h4 className="font-semibold text-foreground">¿Por qué te lo recomendamos?</h4>
                <p className="text-foreground/80 mb-4">{result.reasoning}</p>

                {result.suggestedNextQuestions && result.suggestedNextQuestions.length > 0 && (
                    <>
                        <h4 className="font-semibold text-foreground">Siguientes pasos:</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {result.suggestedNextQuestions.map((q, i) => (
                                <Button key={i} variant="outline" size="sm" onClick={() => setQuery(q)}>
                                    {q}
                                </Button>
                            ))}
                        </div>
                    </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
