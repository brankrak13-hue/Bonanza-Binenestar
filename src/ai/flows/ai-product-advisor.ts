'use server';
/**
 * @fileOverview An AI-powered product advisor for Bonanza Arte & Bienestar services.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiProductAdvisorInputSchema = z.object({
  userQuery: z.string().describe(
    'The user\'s needs, feelings, or physical condition.'
  ),
  language: z.enum(['es', 'en']).default('es'),
});
export type AiProductAdvisorInput = z.infer<typeof AiProductAdvisorInputSchema>;

const AiProductAdvisorOutputSchema = z.object({
  productName: z.string().describe('The name of the recommended Bonanza service.'),
  productType: z.enum(['masaje', 'terapia', 'facial', 'otro', 'massage', 'therapy']).describe('The type of the recommended service.'),
  description: z.string().describe('A detailed description of the recommended service.'),
  reasoning: z.string().describe('An explanation of why this service fits the user\'s needs.'),
  suggestedNextQuestions: z.array(z.string()).describe('A list of follow-up questions.'),
});
export type AiProductAdvisorOutput = z.infer<typeof AiProductAdvisorOutputSchema>;

export async function aiProductAdvisor(input: AiProductAdvisorInput): Promise<AiProductAdvisorOutput> {
  return aiProductAdvisorFlow(input);
}

const productAdvisorPrompt = ai.definePrompt({
  name: 'productAdvisorPrompt',
  input: { schema: AiProductAdvisorInputSchema },
  output: { schema: AiProductAdvisorOutputSchema },
  prompt: `You are an expert wellness advisor for "Bonanza Arte & Bienestar".
Your goal is to recommend a single treatment from our menu that best fits the user's needs.

IMPORTANT: Respond in the language specified in the input (current language: {{{language}}}).

Menu of services:
- Purificación Sutil (Drenaje): Gentle movements to reduce inflammation.
- Fluidez Esencial (Sueco): Soft strokes for deep calm.
- Liberación de Tensión (Tejido Profundo): Deep technique for muscle relief.
- Re-inicia tu Mente (Cráneo Facial): Dissolves deep-seated tension.
- Despertar Vital (Quiromasaje): Releases back and shoulder emotions.
- Moldea tu figura (Reductivo): Intense massage to activate the body.
- Terapia de Sound Healing: Harmonic sounds with Tibetan bowls.

User's request: {{{userQuery}}}

Recommend one service. Ensure all fields in the JSON response are in {{{language}}}.`,
});

const aiProductAdvisorFlow = ai.defineFlow(
  {
    name: 'aiProductAdvisorFlow',
    inputSchema: AiProductAdvisorInputSchema,
    outputSchema: AiProductAdvisorOutputSchema,
  },
  async (input) => {
    const { output } = await productAdvisorPrompt(input);
    return output!;
  }
);
