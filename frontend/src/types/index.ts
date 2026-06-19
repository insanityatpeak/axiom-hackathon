export interface AgentResult {
  id: number;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'complete' | 'error';
  icon: string;
  output?: string;
}

export interface UserProfile {
  user_id: string;
  solving_patterns: Record<string, { success_rate: number; avg_time: number; count: number }>;
  language_preferences: Record<string, number>;
  algorithm_strengths: Record<string, number>;
  weak_areas: Record<string, number>;
  total_solutions: number;
  improvement_curve: Record<string, number>;
  last_updated: string;
  solution_history: SolutionSummary[];
}

export interface SolutionSummary {
  solution_id: string;
  problem_id: string;
  algorithm: string;
  language: string;
  percentile: string;
  submitted_at: string;
}

export interface AnalysisResult {
  time_complexity: string;
  space_complexity: string;
  edge_cases_missed: string[];
  code_quality_issues: string[];
  algorithmic_flaws: string[];
  severity: string;
}

export interface OptimizationSuggestion {
  optimization: string;
  reasoning: string;
  code: string;
  expected_improvement: string;
  priority: number;
  user_match_score: number;
}

export interface BenchmarkResult {
  variant_id: string;
  time_complexity: string;
  space_complexity: string;
  estimated_runtime_ms: number;
  percentile: string;
  memory_mb: number;
}

export interface Recommendation {
  problem_id: string;
  title: string;
  category: string;
  difficulty: string;
  why_recommended: string;
  success_probability: number;
}

export interface WorkflowResult {
  solution_id: string;
  analysis: AnalysisResult;
  optimization: { suggestions: OptimizationSuggestion[] };
  benchmarks: { benchmarks: BenchmarkResult[] };
  recommendations: Recommendation[];
  learning: {
    new_patterns: string[];
    strength_updates: Record<string, number>;
    weak_area_updates: Record<string, number>;
    templates_extracted: string[];
    confidence: number;
  };
  audit: {
    approved: boolean;
    confidence: number;
    summary: string;
    key_insights: string[];
    next_steps: string[];
  };
  patterns: {
    algorithm_type: string;
    approach: string;
    language_match: number;
  };
}

export interface PersonalQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  link?: string;
  notes?: string;
  dateAdded: string;
}
