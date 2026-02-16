'use server';
/**
 * @fileOverview An AI assistant that recommends luxury products based on recipient and occasion details.
 *
 * - recommendLuxuryGift - A function that handles the luxury gift recommendation process.
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
    productName: z.string().describe('The name of the recommended luxury product.'),
    category: z.string().describe('The category of the product (e.g., Perfume, Skincare, Makeup, Accessory).'),
    description: z.string().describe('A brief description of the product and its key features.'),
    reason: z.string().describe('The reason this product is recommended based on the provided recipient and occasion details.'),
  })).describe('A list of luxury product recommendations.'),
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
  prompt: `You are an expert luxury gift recommender for Bonanza Parfum, a high-end brand specializing in perfumes, makeup, skincare, and exclusive experiences.
Your goal is to suggest thoughtful and suitable luxury products from Bonanza Parfum based on the provided information about the gift recipient and the occasion.
Consider the brand's aesthetic (elegant, sophisticated, high-quality) in your recommendations.

Provide at least 3 distinct product recommendations. For each recommendation, include the product name, its category, a brief description, and a clear reason why it is suitable based on the input.
Finally, provide an overall summary of your suggestions.

Recipient Personality: {{{recipientPersonality}}}
{{#if preferredScents}}Preferred Scents: {{{preferredScents}}}{{/if}}
Occasion: {{{occasion}}}
{{#if budget}}Budget: {{{budget}}}{{/if}}
{{#if additionalInfo}}Additional Information: {{{additionalInfo}}}{{/if}}

Focus on recommending products that truly align with the luxury and personalized feel of Bonanza Parfum.
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
