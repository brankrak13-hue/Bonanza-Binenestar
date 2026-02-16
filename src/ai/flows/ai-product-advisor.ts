'use server';
/**
 * @fileOverview An AI-powered product advisor for Bonanza (Guerlain clone) products.
 *
 * - aiProductAdvisor - A function that provides product recommendations based on user preferences.
 * - AiProductAdvisorInput - The input type for the aiProductAdvisor function.
 * - AiProductAdvisorOutput - The return type for the aiProductAdvisor function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiProductAdvisorInputSchema = z.object({
  userQuery: z.string().describe(
    'The user\'s preferences or query for a product recommendation. Examples: "a fresh, floral perfume for daily wear", "makeup for oily skin", "skincare for anti-aging".'
  ),
});
export type AiProductAdvisorInput = z.infer<typeof AiProductAdvisorInputSchema>;

const AiProductAdvisorOutputSchema = z.object({
  productName: z.string().describe('The name of the recommended Bonanza product.'),
  productType: z.enum(['perfume', 'makeup', 'skincare', 'spa', 'other']).describe('The type of the recommended product.'),
  description: z.string().describe('A detailed description of the recommended product, highlighting its key features and benefits.'),
  reasoning: z.string().describe('An explanation of why this product fits the user\'s preferences or query.'),
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
  prompt: `You are an expert product advisor for BONANZA, a luxury brand specializing in perfumes, makeup, and skincare, inspired by Guerlain.
Your goal is to recommend a single BONANZA product that best fits the user's preferences and provide a detailed explanation.
After your recommendation, suggest a few follow-up questions to help the user explore further or refine their needs.

Here is some context about Bonanza product categories:
- Perfumes: Unique fragrances with various scent notes (floral, woody, citrus, oriental, etc.) and concentrations (Eau de Parfum, Eau de Toilette).
- Makeup: High-quality cosmetics for face, eyes, and lips, often focusing on luxurious textures and finishes.
- Skincare: Advanced treatments for anti-aging, hydration, brightening, and other specific concerns, using premium ingredients.
- Spas: Exclusive treatments and experiences at Bonanza spas.

User's request: {{{userQuery}}}

Consider the user's query carefully. If their query does not directly specify a product type, infer one based on keywords. If a clear product type cannot be inferred, ask for clarification in the suggested next questions.

Your response should be structured as a JSON object with the following fields: productName, productType, description, reasoning, and suggestedNextQuestions.`,
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
