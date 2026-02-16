'use server';
/**
 * @fileOverview An AI-powered product advisor for Bonanza Arte & Bienestar services.
 *
 * - aiProductAdvisor - A function that provides service recommendations based on user needs.
 * - AiProductAdvisorInput - The input type for the aiProductAdvisor function.
 * - AiProductAdvisorOutput - The return type for the aiProductAdvisor function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiProductAdvisorInputSchema = z.object({
  userQuery: z.string().describe(
    'The user\'s needs, feelings, or physical condition. Examples: "I feel stressed and have back pain", "I want a facial to rejuvenate my skin".'
  ),
});
export type AiProductAdvisorInput = z.infer<typeof AiProductAdvisorInputSchema>;

const AiProductAdvisorOutputSchema = z.object({
  productName: z.string().describe('The name of the recommended Bonanza service.'),
  productType: z.enum(['masaje', 'terapia', 'facial', 'otro']).describe('The type of the recommended service.'),
  description: z.string().describe('A detailed description of the recommended service, highlighting its key features and benefits.'),
  reasoning: z.string().describe('An explanation of why this service fits the user\'s needs.'),
  suggestedNextQuestions: z.array(z.string()).describe('A list of follow-up questions to continue the conversation and refine recommendations.'),
});
export type AiProductAdvisorOutput = z.infer<typeof AiProductAdvisorOutputSchema>;

export async function aiProductAdvisor(input: AiProductAdvisorInput): Promise<AiProductAdvisorOutput> {
  return aiProductAdvisorFlow(input);
}

const productAdvisorPrompt = ai.definePrompt({
  name: 'productAdvisorPrompt',
  input: { schema: AiProductAdvisorInputSchema },
  output: { schema: AiProductAdvisorOutputSchema },
  prompt: `You are an expert wellness advisor for "Bonanza Arte & Bienestar", a sanctuary for holistic well-being specializing in personalized massages and sound healing therapies.
Your goal is to recommend a single treatment from our menu that best fits the user's needs, feelings, or physical condition, and provide a detailed explanation.
After your recommendation, suggest a few follow-up questions to help the user explore further or refine their needs.

Here is the menu of services we offer at Bonanza:
- Purificación Sutil (Drenaje): Gentle movements to reduce inflammation and promote lightness.
- Fluidez Esencial (Sueco): Soft, continuous strokes to release tension and induce deep calm.
- Liberación de Tensión (Tejido Profundo): Deep technique for rigid areas to relax and revitalize muscles.
- Re-inicia tu Mente (Cráneo Facial): A profound treatment to dissolve deep-seated tension, promoting rest and renewal.
- Despertar Vital (Quiromasaje): Intuitive hands releasing crystallized emotions in the back and shoulders.
- Moldea tu figura (Reductivo): Intense massage to activate the body and help with fluid retention.
- Terapia de Sound Healing: A bath of harmonic sounds with Tibetan bowls to balance energy centers and reduce stress.

User's request: {{{userQuery}}}

Based on the user's query, recommend one of the services from the menu. The 'productName' in your response must be one of the official service titles (e.g., 'Purificación Sutil', 'Terapia de Sound Healing').
Explain why your recommendation is the best fit for them.

Your response should be structured as a JSON object with the following fields: productName, productType, description, reasoning, and suggestedNextQuestions.
For 'productType', use 'masaje' for most massages, 'facial' for 'Re-inicia tu Mente', and 'terapia' for 'Sound Healing'.`,
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
