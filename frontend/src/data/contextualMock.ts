/**
 * Generates contextual mock analysis results based on the user's actual input
 * (code, problem ID, language, description).
 *
 * When no Groq API key is provided, this creates plausible-looking results
 * that reference the user's actual problem and code rather than hardcoded demo data.
 * Also generates profile data (algorithm_strengths, weak_areas, improvement_curve)
 * so the profile panel shows visual charts even in mock mode.
 */
import type { WorkflowResult, UserProfile } from '../types';

/** Guess time complexity from code structure */
function guessTimeComplexity(code: string): string {
  const lines = code.split('\n').map(l => l.trim()).filter(Boolean);
  let loopDepth = 0;
  let maxLoopDepth = 0;
  let hasRecursion = false;

  for (const line of lines) {
    const loopKeywords = ['for ', 'while ', 'do {'];
    const isLoop = loopKeywords.some(k => line.startsWith(k) || line.includes(k));
    if (isLoop) {
      loopDepth++;
      maxLoopDepth = Math.max(maxLoopDepth, loopDepth);
    }
    if (line === '}' && loopDepth > 0) {
      loopDepth--;
    }
  }

  const funcMatch = code.match(/(?:def|function|fn|fun)\s+(\w+)/);
  if (funcMatch) {
    const funcName = funcMatch[1];
    const regex = new RegExp(`\\b${funcName}\\b`, 'g');
    const matches = code.match(regex);
    if (matches && matches.length > 1) {
      hasRecursion = true;
    }
  }

  const hasSort = /\b(sort|sorted|Arrays\.sort|Collections\.sort)\b/.test(code);

  if (hasRecursion && maxLoopDepth === 0) return 'O(2^n)';
  if (maxLoopDepth >= 3) return 'O(n³)';
  if (maxLoopDepth === 2) return hasSort ? 'O(n² log n)' : 'O(n²)';
  if (maxLoopDepth === 1) return hasSort ? 'O(n log n)' : 'O(n)';
  if (hasSort) return 'O(n log n)';
  return 'O(1)';
}

/** Guess space complexity based on extra data structures */
function guessSpaceComplexity(code: string): string {
  const hasHash = /\b(Map|HashMap|Dictionary|dict|object\s*\{|Set|HashSet)\b/.test(code);
  const hasArray = /\b(new\s+(Array|List|ArrayList|vector)|\[\]|list\s*\(|\[\s*\])\b/.test(code);
  const hasRecursion = /\b(def|function|fn)\s+\w+[\s\S]*?\b\1\b/.test(code);
  if (hasRecursion) return 'O(n)';
  if (hasHash || hasArray) return 'O(n)';
  return 'O(1)';
}

/** Generate edge cases based on code structure */
function generateEdgeCases(code: string): string[] {
  const edges: string[] = [];
  if (/for|while/.test(code)) edges.push('Empty input — loop may not execute');
  if (/\b(arr|nums|list|array|input)\b/i.test(code)) {
    edges.push('Single-element input — edge case for index bounds');
    edges.push('Null/undefined input — missing guard clause');
  }
  if (/===?\s*\d/.test(code) || /==\s*\d/.test(code)) edges.push('Hardcoded numeric comparison may miss boundary values');
  if (/\b(length|len|size)\s*-\s*1/.test(code)) edges.push('Off-by-one: check if last element is correctly handled');
  if (edges.length === 0) {
    edges.push('Empty input case not handled');
    edges.push('Large input may cause performance degradation');
  }
  return edges.slice(0, 4);
}

/** Generate quality issues */
function generateQualityIssues(code: string): string[] {
  const issues: string[] = [];
  if (!/def |function |fn |public\s+\w+\s+\w+\s*\(/.test(code)) issues.push('Missing function signature or definition');
  const singleLetterVars = code.match(/\b([a-z])\b/g);
  const uniqueSingleLetters = [...new Set(singleLetterVars || [])].filter(l => l !== 'i' && l !== 'j' && l !== 'k');
  if (uniqueSingleLetters.length > 0) issues.push(`Consider more descriptive names for: ${uniqueSingleLetters.slice(0, 3).join(', ')}`);
  if (!/"""|'''|\/\/.*|#/.test(code)) issues.push('No comments or docstring explaining the approach');
  if (!/if\s+(!|\s*===?\s*null|typeof|isNull|isEmpty)/.test(code)) issues.push('Missing input validation / guard clauses');
  if (issues.length === 0) issues.push('Code could benefit from more defensive checks');
  return issues.slice(0, 3);
}

/** Detect algorithm type from code */
function guessAlgorithmType(code: string, problemId: string): string {
  const id = problemId.toUpperCase();
  if (code.includes('HashMap') || code.includes('dict') || code.includes('Map(') || code.includes('seen') || code.includes('hash')) return 'HashTable';
  if (code.includes('while') && code.includes('<') && (code.includes('left') || code.includes('right') || code.includes('low') || code.includes('high'))) return 'BinarySearch';
  if (code.includes('for') && code.includes('for') && code.includes('left') && code.includes('right')) return 'TwoPointer';
  if (code.includes('dp[') || code.includes('DP[') || code.includes('memo[')) return 'DP';
  if (code.includes('queue') || code.includes('bfs') || code.includes('BFS')) return 'BFS';
  if (code.includes('stack') || code.includes('Stack')) return 'Stack';
  if (/LC-?00(1|167|15)/i.test(id)) return 'TwoPointer';
  if (/LC-?0(03|20|155)/i.test(id)) return 'Stack';
  if (/LC-?0(21|23|56)/i.test(id)) return 'MergeSort';
  if (/LC-?0(53|300|322)/i.test(id)) return 'DP';
  if (/LC-?0(46|78|79)/i.test(id)) return 'Backtracking';
  if (/LC-?1(21|42|11)/i.test(id)) return 'SlidingWindow';
  return 'Array';
}

/** Extract function signature from code */
function extractFunctionSignature(code: string, language: string): string {
  if (language === 'python') {
    const m = code.match(/(def\s+\w+\s*\([^)]*\)\s*(?:->\s*\w+)?\s*:)/);
    return m ? m[1] : 'def solve(data):';
  }
  if (language === 'javascript' || language === 'typescript') {
    const m = code.match(/((?:function|const|let|var)\s+\w+\s*(?:=\s*)?(?:\([^)]*\))\s*(?::\s*\w+)?\s*(?:=>)?\s*\{?)/);
    return m ? m[1] : 'function solve(data) {';
  }
  if (language === 'java' || language === 'cpp' || language === 'csharp') {
    const m = code.match(/(\w+\s+\w+\s*\([^)]*\)\s*(?:throws\s+\w+)?\s*\{?)/);
    return m ? m[1] : 'public int[] solve(int[] data) {';
  }
  return 'function solve(data) {';
}

/** Generate an optimized version of the user's code */
function generateOptimizedCode(
  code: string,
  language: string,
  algoType: string,
  timeComplexity: string,
): string {
  const lines = code.split('\n').filter(l => l.trim());
  const sig = extractFunctionSignature(code, language);

  // Try to extract variable names from the code
  const varNames = code.match(/\b(arr|nums|list|array|values|data|input|a|b|s|t|target|val|n|m|k)\b/g) || [];
  const primaryVar = varNames[0] || 'data';
  const targetVar = varNames.find(v => v === 'target' || v === 't') || 'target';

  if (timeComplexity.includes('²') || timeComplexity.includes('³') || timeComplexity.includes('2^n')) {
    if (algoType === 'HashTable') {
      return `${sig}
    # Optimized: O(n) using hash map for lookups
    seen = {}  # value -> index mapping
    for i, val in enumerate(${primaryVar}):
        complement = ${targetVar} - val
        if complement in seen:
            return [seen[complement], i]
        seen[val] = i
    return []  # no solution found`;
    }
    if (algoType === 'TwoPointer') {
      return `${sig}
    # Optimized: O(n) using two-pointer technique
    left, right = 0, len(${primaryVar}) - 1
    while left < right:
        curr = ${primaryVar}[left] + ${primaryVar}[right]
        if curr == ${targetVar}:
            return [left, right]
        elif curr < ${targetVar}:
            left += 1
        else:
            right -= 1
    return []  # no solution found`;
    }
    if (algoType === 'BinarySearch') {
      return `${sig}
    # Optimized: O(log n) using binary search
    left, right = 0, len(${primaryVar}) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if ${primaryVar}[mid] == ${targetVar}:
            return mid
        elif ${primaryVar}[mid] < ${targetVar}:
            left = mid + 1
        else:
            right = mid - 1
    return -1  # not found`;
    }
    if (algoType === 'DP') {
      return `${sig}
    # Optimized: O(n) dynamic programming with space optimization
    if not ${primaryVar}:
        return 0
    prev, curr = 0, ${primaryVar}[0]
    for i in range(1, len(${primaryVar})):
        prev, curr = curr, max(curr, prev + ${primaryVar}[i])
    return curr`;
    }
  }

  // Even if not brute-force, provide improved version with validation
  return `${sig}
    # Improved: added input validation and edge case handling
    if not ${primaryVar}:
        return []  # handle empty input

    # Your original logic enhanced with guards
    # (Original algorithm preserved, validation added)
    result = []
    # ... your core logic here with ${algoType} pattern
    # Key improvement: handle edge cases before core computation
    return result`;
}

/** Generate profile data (algorithm strengths, weak areas, improvement curve) */
export function generateProfileData(
  existingProfile: UserProfile | null,
  algoType: string,
  timeComplexity: string,
  language: string,
): Partial<UserProfile> {
  const strengths: Record<string, number> = { ...(existingProfile?.algorithm_strengths || {}) };
  const weakAreas: Record<string, number> = { ...(existingProfile?.weak_areas || {}) };
  const solvingPatterns: Record<string, { success_rate: number; avg_time: number; count: number }> = {
    ...(existingProfile?.solving_patterns || {}),
  };
  const improvementCurve: Record<string, number> = { ...(existingProfile?.improvement_curve || {}) };

  // Update algorithm strength based on detected algo type
  const currentStrength = strengths[algoType] || 50;
  const improvement = timeComplexity.includes('²') || timeComplexity.includes('³') ? 3 : 8;
  strengths[algoType] = Math.min(100, currentStrength + improvement);

  // Populate other algorithm areas (some as strengths, some as weak areas)
  const allAlgos = ['HashTable', 'TwoPointer', 'BinarySearch', 'DP', 'BFS', 'Stack', 'SlidingWindow', 'Backtracking'];
  for (const algo of allAlgos) {
    if (algo === algoType) continue; // already handled above
    if (!(algo in strengths) && !(algo in weakAreas)) {
      const baseScore = 30 + Math.floor(Math.random() * 40);
      if (baseScore > 55) {
        strengths[algo] = baseScore;
      } else {
        weakAreas[algo] = baseScore;
      }
    }
  }

  // Update solving patterns
  solvingPatterns[algoType] = {
    success_rate: Math.min(1, (solvingPatterns[algoType]?.success_rate || 0.7) + 0.02),
    avg_time: Math.max(5, (solvingPatterns[algoType]?.avg_time || 15) - 0.5),
    count: (solvingPatterns[algoType]?.count || 0) + 1,
  };

  // Update improvement curve (last 7 data points-ish)
  const now = new Date();
  const existingKeys = Object.keys(improvementCurve).sort();
  let basePercentile = 40;
  if (existingKeys.length > 0) {
    const lastVal = improvementCurve[existingKeys[existingKeys.length - 1]];
    basePercentile = typeof lastVal === 'number' ? lastVal : 40;
  }
  const trend = timeComplexity.includes('²') || timeComplexity.includes('³') ? -2 : 5;
  const newVal = Math.min(95, Math.max(15, basePercentile + trend + Math.floor(Math.random() * 8) - 3));
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  improvementCurve[key] = newVal;

  // Language preferences
  const langPrefs: Record<string, number> = { ...(existingProfile?.language_preferences || {}) };
  langPrefs[language] = (langPrefs[language] || 0) + 5;

  return {
    algorithm_strengths: strengths,
    weak_areas: weakAreas,
    solving_patterns: solvingPatterns,
    improvement_curve: improvementCurve,
    language_preferences: langPrefs,
  };
}

/** Generate a contextual mock WorkflowResult from the user's actual inputs */
export function generateContextualMock(
  code: string,
  problemId: string,
  language: string,
  problemDescription: string,
): WorkflowResult {
  const timeComplexity = guessTimeComplexity(code);
  const spaceComplexity = guessSpaceComplexity(code);
  const algoType = guessAlgorithmType(code, problemId);
  const edgeCases = generateEdgeCases(code);
  const qualityIssues = generateQualityIssues(code);

  const solutionId = `sol-${Date.now()}`;
  const severity = timeComplexity.includes('²') || timeComplexity.includes('³') ? 'medium' : 'low';
  const hasOptimization = timeComplexity.includes('²') || timeComplexity.includes('³') || timeComplexity.includes('2^n');

  const suggestions: { optimization: string; reasoning: string; code: string; expected_improvement: string; priority: number }[] = [];

  if (hasOptimization) {
    const optimizedCode = generateOptimizedCode(code, language, algoType, timeComplexity);
    suggestions.push({
      optimization: `${algoType} — Optimized Approach`,
      reasoning: `Your current solution runs in ${timeComplexity}. The ${algoType} pattern achieves O(n) time by using ${
        algoType === 'HashTable' ? 'a hash map for O(1) lookups instead of nested loops' :
        algoType === 'TwoPointer' ? 'two pointers moving toward each other in one pass' :
        algoType === 'BinarySearch' ? 'divide-and-conquer to halve the search space each iteration' :
        algoType === 'DP' ? 'optimal substructure to avoid redundant computations' :
        'a more efficient algorithmic approach'
      }. This is especially beneficial for large inputs.`,
      code: optimizedCode,
      expected_improvement: `${timeComplexity} → O(n)`,
      priority: 1,
    });
  }

  // Enhanced suggestions based on actual code analysis
  const hasValidation = /if\s+(!|===?\s*null|typeof|isNull|isEmpty|\.length\s*===?\s*0|not\s+\w+)/.test(code);
  if (!hasValidation) {
    const improvedCode = generateOptimizedCode(code, language, algoType, timeComplexity);
    suggestions.push({
      optimization: 'Add Input Validation & Guard Clauses',
      reasoning: `Your code lacks input validation. For problem ${problemId}, inputs may be empty, null, or contain unexpected values. Adding guard clauses at the start prevents runtime errors and makes your solution more robust.`,
      code: improvedCode,
      expected_improvement: 'Eliminates runtime errors on edge cases',
      priority: hasOptimization ? 2 : 1,
    });
  }

  const hasDocstring = /"""|'''|\/\/.*|#/.test(code);
  if (!hasDocstring && suggestions.length < 3) {
    suggestions.push({
      optimization: 'Add Documentation & Clear Naming',
      reasoning: 'Your code lacks comments or a docstring. Adding a brief description of the approach and renaming single-letter variables to descriptive names makes your solution easier to understand in interviews and code reviews.',
      code: `"""\nSolution for ${problemId} using ${algoType} approach.\n\nTime: ${timeComplexity} | Space: ${spaceComplexity}\n"""\n${code}`,
      expected_improvement: 'Better interview performance & code review scores',
      priority: 3,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      optimization: 'Refine Algorithmic Approach',
      reasoning: `Your solution is functional. Consider exploring alternative approaches to ${problemId} — trying different algorithmic patterns builds versatility.`,
      code: code,
      expected_improvement: 'Broader algorithmic knowledge',
      priority: 1,
    });
  }

  // Enhanced recommendations
  const relatedAlgos: Record<string, string[]> = {
    HashTable: ['TwoPointer', 'SlidingWindow'],
    TwoPointer: ['HashTable', 'SlidingWindow'],
    BinarySearch: ['TwoPointer', 'MergeSort'],
    DP: ['Backtracking', 'Greedy'],
    BFS: ['DFS', 'Stack'],
    Stack: ['Queue', 'TwoPointer'],
    SlidingWindow: ['TwoPointer', 'HashTable'],
    Backtracking: ['DP', 'BFS'],
    MergeSort: ['BinarySearch', 'TwoPointer'],
    Array: ['HashTable', 'TwoPointer'],
  };
  const related = relatedAlgos[algoType] || ['HashTable', 'TwoPointer'];

  const recommendations = [
    {
      problem_id: problemId,
      title: `Revisit ${problemId} (Optimized)`,
      category: algoType,
      difficulty: 'Medium' as const,
      why_recommended: `Apply the ${algoType} optimization to reinforce this pattern. Your current solution runs in ${timeComplexity} — improving it will solidify the ${algoType.toLowerCase()} technique.`,
      success_probability: 0.85,
    },
    {
      problem_id: `${problemId}-alt`,
      title: `${problemId} — Using ${related[0]}`,
      category: related[0],
      difficulty: 'Medium' as const,
      why_recommended: `Solving ${problemId} with ${related[0]} instead of ${algoType} strengthens your ability to choose the right tool for the job.`,
      success_probability: 0.72,
    },
    {
      problem_id: `${related[1] || 'Array'}-practice`,
      title: `${related[1] || 'Array'} Pattern Practice`,
      category: related[1] || 'Array',
      difficulty: 'Easy' as const,
      why_recommended: `You've shown aptitude in ${algoType}. Building strength in ${related[1] || 'related patterns'} rounds out your skills.`,
      success_probability: 0.68,
    },
  ];

  const benchmarks = [
    {
      variant_id: 'original',
      time_complexity: timeComplexity,
      space_complexity: spaceComplexity,
      estimated_runtime_ms: timeComplexity.includes('²') ? 800 + Math.random() * 600 : 100 + Math.random() * 200,
      percentile: timeComplexity.includes('²') ? 'top 30%' : 'top 50%',
      memory_mb: spaceComplexity.includes('n') ? 6 + Math.random() * 6 : 1 + Math.random() * 2,
    },
    {
      variant_id: hasOptimization ? 'hash_table' : 'enumerate',
      time_complexity: hasOptimization ? 'O(n)' : timeComplexity,
      space_complexity: 'O(n)',
      estimated_runtime_ms: 50 + Math.random() * 150,
      percentile: 'top 5%',
      memory_mb: 8 + Math.random() * 6,
    },
    {
      variant_id: hasOptimization ? 'enumerate' : 'optimized',
      time_complexity: hasOptimization ? 'O(n)' : timeComplexity,
      space_complexity: 'O(1)',
      estimated_runtime_ms: 120 + Math.random() * 200,
      percentile: 'top 15%',
      memory_mb: 2 + Math.random() * 3,
    },
  ];

  return {
    solution_id: solutionId,
    analysis: {
      time_complexity: timeComplexity,
      space_complexity: spaceComplexity,
      edge_cases_missed: edgeCases,
      code_quality_issues: qualityIssues,
      algorithmic_flaws: [
        hasOptimization
          ? `Brute-force ${timeComplexity} — can be optimized to O(n) with ${algoType.toLowerCase()} pattern`
          : 'Consider alternative approaches for comparison',
        !/if\s+(!|===?\s*null|typeof|isNull|isEmpty)/.test(code)
          ? 'Input validation could be more thorough'
          : 'Edge case coverage is adequate but could be expanded',
      ],
      severity,
    },
    optimization: { suggestions: suggestions.map((s, i) => ({ ...s, user_match_score: 0.85 - i * 0.05 })) },
    benchmarks: { benchmarks },
    recommendations,
    learning: {
      new_patterns: suggestions.length > 0
        ? [suggestions[0].optimization, `${algoType} application`, ...(related.slice(0, 1))]
        : [`${algoType} fundamentals`],
      strength_updates: { [algoType]: hasOptimization ? 3 : 8 },
      weak_area_updates: {},
      templates_extracted: [`${algoType.toLowerCase()}_template`],
      confidence: 0.78,
    },
    audit: {
      approved: true,
      confidence: 0.78,
      summary: `Analysis of ${problemId} in ${language}: your solution runs in ${timeComplexity} time / ${spaceComplexity} space. ${
        hasOptimization
          ? `The ${algoType.toLowerCase()} pattern could reduce complexity. ${edgeCases.length > 0 ? 'Watch out for edge cases like ' + edgeCases.slice(0, 2).join(' and ').toLowerCase() + '.' : ''}`
          : 'A solid approach. Consider edge case coverage and code readability improvements suggested below.'
      }`,
      key_insights: [
        `Detected pattern: ${algoType}`,
        `Current time complexity: ${timeComplexity}`,
        qualityIssues.length > 0 ? `Code quality note: ${qualityIssues[0]}` : 'Code structure looks reasonable',
        `${language} solution detected — ${problemDescription ? 'description provided' : 'no description provided, analysis based on code alone'}`,
      ],
      next_steps: [
        hasOptimization ? `Try the ${algoType.toLowerCase()} optimized approach for ${problemId}` : `Review edge cases for ${problemId}`,
        `Practice similar ${algoType} problems to build pattern recognition`,
        'Set up a free Groq API key for AI-powered personalized analysis',
      ],
    },
    patterns: {
      algorithm_type: algoType,
      approach: hasOptimization ? 'brute-force' : 'direct',
      language_match: 0.85,
    },
  };
}
