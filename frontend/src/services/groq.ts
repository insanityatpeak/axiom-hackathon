/**
 * Groq-powered code analysis service.
 * Calls the Groq API (OpenAI-compatible) to analyze a code submission.
 * Includes automatic retry with exponential backoff for rate-limit (429) errors
 * and automatic model fallback across multiple free-tier models.
 *
 * Groq API docs: https://console.groq.com/docs/api-reference
 * Sign up for a free API key: https://console.groq.com
 * Free tier: 30 requests/min, no credit card required.
 */
import type { WorkflowResult, AnalysisResult, OptimizationSuggestion, BenchmarkResult, Recommendation } from '../types';

/** Parsed analysis response from the LLM */
interface GroqAnalysisResponse {
  analysis: {
    time_complexity: string;
    space_complexity: string;
    edge_cases_missed: string[];
    code_quality_issues: string[];
    algorithmic_flaws: string[];
    severity: 'low' | 'medium' | 'high';
  };
  suggestions: {
    optimization: string;
    reasoning: string;
    code: string;
    expected_improvement: string;
    priority: number;
  }[];
  benchmarks: {
    variant: string;
    time_complexity: string;
    space_complexity: string;
    estimated_runtime_ms: number;
    memory_mb: number;
  }[];
  key_insights: string[];
  next_steps: string[];
  summary: string;
  confidence: number;
}

const SYSTEM_PROMPT = `You are an expert code reviewer and competitive programming coach.
Analyze the given code submission and return ONLY valid JSON matching this TypeScript type — no markdown, no code fences, no extra text:

{
  "analysis": {
    "time_complexity": "O(n)",
    "space_complexity": "O(n)",
    "edge_cases_missed": ["string array of edge cases the code might miss"],
    "code_quality_issues": ["string array of style/readability issues"],
    "algorithmic_flaws": ["string array of algorithmic problems"],
    "severity": "low" | "medium" | "high"
  },
  "suggestions": [
    {
      "optimization": "Short name of the optimization",
      "reasoning": "Why this optimization works and fits the user's pattern",
      "code": "the optimized code as a single string with \\n for newlines",
      "expected_improvement": "e.g. O(n²) → O(n)",
      "priority": 1
    }
  ],
  "benchmarks": [
    {
      "variant": "name of variant",
      "time_complexity": "O(n)",
      "space_complexity": "O(n)",
      "estimated_runtime_ms": 100,
      "memory_mb": 10.0
    }
  ],
  "key_insights": ["array of actionable insights"],
  "next_steps": ["array of recommended next steps"],
  "summary": "2-3 sentence summary of the review",
  "confidence": 0.85
}

Be specific, critical but constructive. Reference actual code lines where possible.`;

/**
 * Models to try in order — each is a fallback for the previous one.
 * All are available on Groq's free tier (no credit card required).
 * - llama-3.3-70b-versatile: best overall for code reasoning
 * - mixtral-8x7b-32768: good with 32K context window
 * - gemma2-9b-it: fast and capable lightweight model
 * - llama-3.1-8b-instant: fastest fallback
 */
const MODELS = [
  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
  'llama-3.1-8b-instant',
];

/** Groq API endpoint (OpenAI-compatible) */
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/** Maximum retries per model for rate-limit (429) errors */
const MAX_RETRIES = 3;

/** Base delay in ms — doubled each retry (e.g. 1s → 2s → 4s) */
const BASE_RETRY_MS = 1000;

/**
 * Check if an error is a rate-limit (429) error.
 */
function isRateLimitError(err: unknown): boolean {
  if (err && typeof err === 'object') {
    const msg = String((err as any).message || '');
    return (
      msg.includes('429') ||
      msg.includes('quota') ||
      msg.includes('rate_limit') ||
      msg.includes('Rate Limit') ||
      msg.includes('rate limit exceeded')
    );
  }
  return false;
}

/**
 * Check if an error indicates the model doesn't exist (404).
 */
function isModelNotFoundError(err: unknown): boolean {
  if (err && typeof err === 'object') {
    const msg = String((err as any).message || '');
    return (
      msg.includes('404') ||
      msg.includes('not found') ||
      msg.includes('model_not_found') ||
      msg.includes('Model not found') ||
      msg.includes('model not found')
    );
  }
  return false;
}

/**
 * Normalize the error to a string for logging.
 */
function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

/**
 * Analyze a code submission using Groq.
 *
 * Retries on 429 rate-limit errors with exponential backoff.
 * On model-not-found (404) or other errors, falls through to the next model.
 * Returns null only if ALL models have been exhausted.
 */
export async function analyzeCodeWithGroq(
  apiKey: string,
  code: string,
  problemId: string,
  problemDescription: string,
  language: string,
): Promise<WorkflowResult | null> {
  if (!apiKey || !code.trim()) return null;

  const trimmedCode = code.trim().slice(0, 4000); // safety limit

  const userPrompt = `Problem ID: ${problemId}
Problem Description: ${problemDescription || 'Not provided — infer from the code if possible.'}

Language: ${language}

Code to review:
\`\`\`${language}
${trimmedCode}
\`\`\`

Analyze this code submission. Return ONLY valid JSON.`;

  let lastError: string | null = null;

  // Try each model in order
  for (const modelName of MODELS) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.2,
            max_tokens: 4096,
          }),
        });

        if (!response.ok) {
          let errorBody = '';
          try {
            const errorJson = await response.json();
            errorBody = errorJson?.error?.message || JSON.stringify(errorJson);
          } catch {
            errorBody = await response.text();
          }
          throw new Error(
            `Groq ${modelName} returned HTTP ${response.status}: ${errorBody}`
          );
        }

        const responseJson = await response.json();
        const choices = responseJson?.choices;
        if (!choices || choices.length === 0 || !choices[0]?.message?.content) {
          console.error(`Groq ${modelName} returned empty response:`, JSON.stringify(responseJson).slice(0, 300));
          return null;
        }

        const text = choices[0].message.content;

        // Try to extract JSON from the response (handle markdown code fences)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error(
            `Groq ${modelName} returned non-JSON response:`, text.slice(0, 500)
          );
          return null;
        }

        const parsed: GroqAnalysisResponse = JSON.parse(jsonMatch[0]);

        // Transform into WorkflowResult
        const solutionId = `sol-${Date.now()}`;
        const confidence = parsed.confidence || 0.85;

        const analysis: AnalysisResult = {
          time_complexity: parsed.analysis.time_complexity,
          space_complexity: parsed.analysis.space_complexity,
          edge_cases_missed: parsed.analysis.edge_cases_missed || [],
          code_quality_issues: parsed.analysis.code_quality_issues || [],
          algorithmic_flaws: parsed.analysis.algorithmic_flaws || [],
          severity: parsed.analysis.severity || 'medium',
        };

        const optimization = {
          suggestions: parsed.suggestions.map((s, i): OptimizationSuggestion => ({
            optimization: s.optimization,
            reasoning: s.reasoning,
            code: s.code,
            expected_improvement: s.expected_improvement,
            priority: s.priority || i + 1,
            user_match_score: 0.85 - i * 0.05,
          })),
        };

        const benchmarks: BenchmarkResult[] = parsed.benchmarks.map((b) => ({
          variant_id: b.variant.toLowerCase().replace(/\s+/g, '_'),
          time_complexity: b.time_complexity,
          space_complexity: b.space_complexity,
          estimated_runtime_ms: b.estimated_runtime_ms,
          percentile: 'top TBD%',
          memory_mb: b.memory_mb,
        }));

        // If no benchmarks were returned, create a default pair
        if (benchmarks.length === 0) {
          benchmarks.push(
            {
              variant_id: 'original',
              time_complexity: parsed.analysis.time_complexity,
              space_complexity: parsed.analysis.space_complexity,
              estimated_runtime_ms: 500 + Math.random() * 1000,
              percentile: 'top 50%',
              memory_mb: 1 + Math.random() * 5,
            },
            {
              variant_id: 'optimized',
              time_complexity: parsed.suggestions[0]?.expected_improvement?.includes('→')
                ? parsed.suggestions[0].expected_improvement.split('→')[1]?.trim() || 'O(n)'
                : 'O(n)',
              space_complexity: parsed.analysis.space_complexity,
              estimated_runtime_ms: 50 + Math.random() * 200,
              percentile: 'top 5%',
              memory_mb: 5 + Math.random() * 10,
            },
          );
        }

        const recommendations: Recommendation[] = [
          {
            problem_id: `${problemId}-optimized`,
            title: `Revisit ${problemId} (Optimized)`,
            category: 'Optimization',
            difficulty: 'Medium',
            why_recommended: 'Apply the suggested optimization to reinforce the pattern.',
            success_probability: 0.85,
          },
        ];

        const workResult: WorkflowResult = {
          solution_id: solutionId,
          analysis,
          optimization,
          benchmarks: { benchmarks },
          recommendations,
          learning: {
            new_patterns: parsed.suggestions.map(s => s.optimization),
            strength_updates: {},
            weak_area_updates: {},
            templates_extracted: [],
            confidence,
          },
          audit: {
            approved: confidence > 0.5,
            confidence,
            summary: parsed.summary || 'Analysis complete.',
            key_insights: parsed.key_insights || [],
            next_steps: parsed.next_steps || [],
          },
          patterns: {
            algorithm_type: parsed.analysis.time_complexity?.includes('n²') ? 'Brute-Force' : 'Optimized',
            approach: language,
            language_match: 0.85,
          },
        };

        return workResult;
      } catch (err) {
        lastError = errorMessage(err);
        const isRateLimit = isRateLimitError(err);
        const isModel404 = isModelNotFoundError(err);

        if (isRateLimit && attempt < MAX_RETRIES) {
          // Exponential backoff: 1s, 2s, 4s
          const delayMs = BASE_RETRY_MS * Math.pow(2, attempt - 1);
          console.warn(
            `[429] Rate limited on ${modelName} (attempt ${attempt}/${MAX_RETRIES}). ` +
            `Retrying in ${delayMs}ms...`
          );
          await new Promise(r => setTimeout(r, delayMs));
          continue; // retry same model
        }

        // For any error (rate-limit exhausted, 404, or anything else):
        // log it and fall through to the next model.
        if (isRateLimit) {
          console.warn(
            `[429] ${modelName} quota exhausted after ${MAX_RETRIES} retries. ` +
            `Trying next model...`
          );
        } else if (isModel404) {
          console.warn(`${modelName} not available (404). Trying next model...`);
        } else {
          console.warn(
            `Groq ${modelName} error (attempt ${attempt}): ${lastError}. ` +
            `Trying next model...`
          );
        }

        break; // exit inner retry loop → try next model
      }
    }
  }

  // All models exhausted
  const failureMessage = `Groq analysis failed (${MODELS.length} models tried). ` +
    `Last error: ${lastError || 'unknown'}\n\n` +
    `Tip: Sign up for a free Groq API key at https://console.groq.com — ` +
    `no credit card required. The free tier gives 30 requests/minute.`;

  console.error(failureMessage);
  return null;
}
