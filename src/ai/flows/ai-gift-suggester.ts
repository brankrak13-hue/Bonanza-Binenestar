'use server';
/**
 * @fileOverview An AI assistant that recommends wellness treatments as gifts based on recipient and occasion details.
 *
 * - recommendLuxuryGift - A function that handles the gift recommendation process.
 * - LuxuryGiftSuggesterInput - The input type for the recommendLuxuryGift function.
 * - LuxuryGiftSuggesterOutput - The return type for the recommendLuxuryGift function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LuxuryGiftSuggesterInputSchema = z.object({
  recipientPersonality: z.string().describe('Description of the recipient’s personality (e.g., adventurous, calm, artistic).'),
  preferredScents: z.string().optional().describe('Any known preferred scents or fragrance families (e.g., floral, woody, oriental).'),
  occasion: z.string().describe('The occasion for the gift (e.g., birthday, anniversary, graduation).'),
  budget: z.string().optional().describe('The approximate budget for the gift (e.g., high-end, moderate, no limit).'),
  additionalInfo: z.string().optional().describe('Any other relevant information about the recipient or gift preferences.'),
});
export type LuxuryGiftSuggesterInput = z.infer<typeof LuxuryGiftSuggesterInputSchema>;

const LuxuryGiftSuggesterOutputSchema = z.object({
  recommendations: z.array(z.object({
    productName: z.string().describe('The name of the recommended wellness service.'),
    category: z.string().describe('The category of the service (e.g., Masaje, Terapia, Facial).'),
    description: z.string().describe('A brief description of the service and its key benefits.'),
    reason: z.string().describe('The reason this service is recommended based on the provided recipient and occasion details.'),
  })).describe('A list of wellness service recommendations.'),
  overallSummary: z.string().describe('An overall summary of the gift suggestions and why they are suitable.'),
});
export type LuxuryGiftSuggesterOutput = z.infer<typeof LuxuryGiftSuggesterOutputSchema>;

export async function recommendLuxuryGift(input: LuxuryGiftSuggesterInput): Promise<LuxuryGiftSuggesterOutput> {
  return luxuryGiftSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'luxuryGiftSuggesterPrompt',
  input: { schema: LuxuryGiftSuggesterInputSchema },
  output: { schema: LuxuryGiftSuggesterOutputSchema },
  prompt: `You are an expert gift recommender for "Bonanza Arte & Bienestar", a sanctuary for holistic well-being specializing in personalized massages and sound healing therapies.
Your goal is to suggest thoughtful and suitable treatments as gifts based on the provided information about the gift recipient and the occasion.
Consider the brand's aesthetic (holistic, serene, restorative, high-quality).

Here is the menu of services we offer at Bonanza:
- Purificación Sutil (Drenaje): Gentle movements to reduce inflammation and promote lightness.
- Fluidez Esencial (Sueco): Soft, continuous strokes to release tension and induce deep calm.
- Liberación de Tensión (Tejido Profundo): Deep technique for rigid areas to relax and revitalize muscles.
- Re-inicia tu Mente (Cráneo Facial): A profound treatment to dissolve deep-seated tension, promoting rest and renewal.
- Despertar Vital (Quiromasaje): Intuitive hands releasing crystallized emotions in the back and shoulders.
- Moldea tu figura (Reductivo): Intense massage to activate the body and help with fluid retention.
- Terapia de Sound Healing: A bath of harmonic sounds with Tibetan bowls to balance energy centers and reduce stress.

Provide at least 3 distinct service recommendations. For each recommendation, the productName must be one of the service titles from the menu.
Include the category, a brief description of the service, and a clear reason why it is a suitable gift based on the input.
Finally, provide an overall summary of your suggestions.

Recipient Personality: {{{recipientPersonality}}}
{{#if preferredScents}}Preferred Scents: {{{preferredScents}}} (Note: we use aromatherapy, this can be relevant){{/if}}
Occasion: {{{occasion}}}
{{#if budget}}Budget: {{{budget}}}{{/if}}
{{#if additionalInfo}}Additional Information: {{{additionalInfo}}}{{/if}}

Focus on recommending services that provide a truly restorative and personalized experience.
`,
});

const luxuryGiftSuggesterFlow = ai.defineFlow(
  {
    name: 'luxuryGiftSuggesterFlow',
    inputSchema: LuxuryGiftSuggesterInputSchema,
    outputSchema: LuxuryGiftSuggesterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
