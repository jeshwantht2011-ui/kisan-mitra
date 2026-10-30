import type {} from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

export default async function chat(req: Request): Promise<Response> {
  const headers = { 'Cache-Control': 'no-store' };
  const error = (message: string, status: number) =>
    Response.json({ error: message }, { status, headers });

  if (req.method !== 'POST') {
    return Response.json(
      { error: 'Use POST to send an AI request.' },
      { status: 405, headers: { ...headers, Allow: 'POST' } },
    );
  }

  let body: unknown;
  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > 100_000) {
      return error('Your conversation is too long. Please start a new chat.', 413);
    }
    body = JSON.parse(raw);
  } catch {
    return error('Invalid JSON request.', 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return error('Invalid AI request.', 400);
  }
  const { system, userContent, langLabel = 'English' } = body as Record<string, unknown>;
  if (
    typeof system !== 'string' ||
    typeof userContent !== 'string' || !userContent.trim() ||
    typeof langLabel !== 'string' || !langLabel.trim() || langLabel.length > 100
  ) {
    return error('Provide a prompt, context, and valid language.', 400);
  }

  const apiKey = Netlify.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return error('AI is not configured. Please contact the site owner.', 503);
  }

  try {
    // Explicit provider configuration keeps this call on the requested Gemini API.
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        baseUrl: 'https://generativelanguage.googleapis.com',
        timeout: 45_000,
      },
    });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `IMPORTANT: You MUST reply only in ${langLabel} language. No other language allowed.\n\n${system}\n\nUser: ${userContent}`,
      config: { maxOutputTokens: 1000, temperature: 0.7 },
    });
    const text = response.text;
    if (!text?.trim()) {
      return error('No response from AI. Please try again.', 502);
    }
    return Response.json({ text }, { headers });
  } catch (cause) {
    // Never return or log provider errors: they can contain request credentials.
    const status = (cause as { status?: number } | null)?.status;
    if (status === 429) {
      return error('AI is busy. Please wait a moment and try again.', 429);
    }
    return error('AI is temporarily unavailable. Please try again.', 502);
  }
}
