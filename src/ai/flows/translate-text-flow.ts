
'use server';
/**
 * @fileOverview A Genkit flow for translating text.
 *
 * - translateText - A function that translates text to a target language.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguageCode: z.string().describe('The ISO 639-1 code of the language to translate to (e.g., "bn" for Bengali, "hi" for Hindi).'),
  sourceLanguageCode: z.string().optional().describe('The ISO 639-1 code of the source language (e.g., "en" for English). Defaults to English if not provided.'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const getLanguageName = (code: string | undefined): string => {
  switch (code?.toLowerCase()) {
    case 'en': return 'English';
    case 'bn': return 'Bengali';
    case 'hi': return 'Hindi';
    default: return 'English'; // Default to English if unknown or not specified
  }
}

const translateTextPrompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: (input) => {
    const sourceLanguage = getLanguageName(input.sourceLanguageCode);
    const targetLanguage = getLanguageName(input.targetLanguageCode);
    return `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only return the translated text, without any introductory phrases or explanations.

Text to translate:
"""
{{{text}}}
"""

Translated text:`
  },
   config: {
    // Adjust temperature for more deterministic translations if needed
    temperature: 0.2,
  }
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    // Ensure a default source language if not provided
    const fullInput = {
      ...input,
      sourceLanguageCode: input.sourceLanguageCode || 'en',
    };
    const {output} = await translateTextPrompt(fullInput);
    if (!output) {
      throw new Error('Translation failed to produce output.');
    }
    return output;
  }
);
