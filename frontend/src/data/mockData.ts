import type { UserProfile, WorkflowResult } from '../types';

export const demoUserProfile: UserProfile = {
  user_id: 'demo_user',
  solving_patterns: {
    'TwoPointer': { success_rate: 0.85, avg_time: 20, count: 12 },
    'HashTable': { success_rate: 0.90, avg_time: 15, count: 18 },
    'DP': { success_rate: 0.75, avg_time: 45, count: 10 },
    'BFS': { success_rate: 0.80, avg_time: 30, count: 8 },
    'BinarySearch': { success_rate: 0.88, avg_time: 18, count: 14 },
  },
  language_preferences: { 'Python': 40, 'Java': 20, 'C++': 10, 'JavaScript': 5, 'TypeScript': 5, 'C#': 5, 'Go': 5, 'Rust': 5, 'Kotlin': 3, 'Swift': 2 },
  algorithm_strengths: {
    'TwoPointer': 88, 'HashTable': 92, 'BinarySearch': 85, 'DFS': 78,
    'BFS': 80, 'DP': 65, 'SlidingWindow': 82, 'Greedy': 45,
    'Math': 70, 'Heap': 52, 'Graph': 60, 'String': 75,
    'BitManipulation': 48, 'Union-Find': 55, 'Trie': 62, 'Geometry': 30,
  },
  weak_areas: {
    'Geometry': 30, 'AdvancedGraph': 35, 'Greedy': 40, 'Heap': 45,
    'BitManipulation': 48, 'DP': 65,
  },
  total_solutions: 42,
  improvement_curve: {
    'Week 1': 65, 'Week 2': 68, 'Week 3': 72, 'Week 4': 70,
    'Week 5': 75, 'Week 6': 78, 'Week 7': 82, 'Week 8': 85,
  },
  last_updated: '2024-12-15T10:30:00Z',
  solution_history: [
    { solution_id: 's1', problem_id: 'LC-001', algorithm: 'HashTable', language: 'Python', percentile: 'top 5%', submitted_at: '2024-12-14T14:30:00Z' },
    { solution_id: 's2', problem_id: 'LC-015', algorithm: 'TwoPointer', language: 'Python', percentile: 'top 8%', submitted_at: '2024-12-13T10:15:00Z' },
    { solution_id: 's3', problem_id: 'LC-020', algorithm: 'Stack', language: 'Java', percentile: 'top 12%', submitted_at: '2024-12-12T16:45:00Z' },
    { solution_id: 's4', problem_id: 'LC-121', algorithm: 'SlidingWindow', language: 'Python', percentile: 'top 10%', submitted_at: '2024-12-11T09:20:00Z' },
    { solution_id: 's5', problem_id: 'LC-167', algorithm: 'TwoPointer', language: 'Python', percentile: 'top 3%', submitted_at: '2024-12-10T11:00:00Z' },
  ],
};

export const mockSampleCode = `def twoSum(arr, target):
    n = len(arr)
    for i in range(n):
        for j in range(i+1, n):
            if arr[i] + arr[j] == target:
                return [i, j]
    return []`;

export const mockWorkflowResult: WorkflowResult = {
  solution_id: 'sol-demo-001',
  analysis: {
    time_complexity: 'O(n²)',
    space_complexity: 'O(1)',
    edge_cases_missed: [
      'Empty array — returns [] but could raise IndexError',
      'Duplicate values — handles? Check if arr[i] == arr[j] and i != j',
      'Negative numbers — sum may overflow in some languages',
      'Large arrays — O(n²) will timeout for n > 10⁴',
    ],
    code_quality_issues: [
      'No type hints on function signature',
      'Variable names could be more descriptive',
      'Missing docstring explaining algorithm',
    ],
    algorithmic_flaws: [
      'Brute-force O(n²) instead of O(n) hash table approach',
      'Does not handle case where target = 2 * arr[i] correctly',
    ],
    severity: 'medium',
  },
  optimization: {
    suggestions: [
      {
        optimization: 'Hash Table for O(n) time',
        reasoning: 'You have a 92% success rate with HashTable solutions. This matches your strongest algorithm pattern. Use a dictionary to store seen values for O(1) lookup.',
        code: 'def twoSum(arr, target):\n    seen = {}\n    for i, val in enumerate(arr):\n        complement = target - val\n        if complement in seen:\n            return [seen[complement], i]\n        seen[val] = i\n    return []',
        expected_improvement: 'O(n²) → O(n), top 5% percentile',
        priority: 1,
        user_match_score: 0.92,
      },
      {
        optimization: 'Early exit with enumerate',
        reasoning: 'Use enumerate() for cleaner index tracking. Stops at first match unlike brute force.',
        code: 'def twoSum(arr, target):\n    for i, x in enumerate(arr):\n        for j, y in enumerate(arr[i+1:], i+1):\n            if x + y == target:\n                return [i, j]\n    return []',
        expected_improvement: 'Minor readability gain, same complexity',
        priority: 2,
        user_match_score: 0.78,
      },
      {
        optimization: 'Binary Search approach (sorted)',
        reasoning: 'If array is sorted, binary search complement. Alternative approach you used in 14 past solutions.',
        code: 'import bisect\ndef twoSum(arr, target):\n    sorted_arr = sorted((val, i) for i, val in enumerate(arr))\n    for i, (val, idx) in enumerate(sorted_arr):\n        complement = target - val\n        j = bisect.bisect_left(sorted_arr, (complement, 0), i+1)\n        if j < len(sorted_arr) and sorted_arr[j][0] == complement:\n            return [idx, sorted_arr[j][1]]\n    return []',
        expected_improvement: 'O(n log n) time, good for sorted inputs',
        priority: 3,
        user_match_score: 0.85,
      },
    ],
  },
  benchmarks: {
    benchmarks: [
      {
        variant_id: 'original',
        time_complexity: 'O(n²)',
        space_complexity: 'O(1)',
        estimated_runtime_ms: 1200,
        percentile: 'top 15%',
        memory_mb: 1.2,
      },
      {
        variant_id: 'hash_table',
        time_complexity: 'O(n)',
        space_complexity: 'O(n)',
        estimated_runtime_ms: 85,
        percentile: 'top 5%',
        memory_mb: 8.5,
      },
      {
        variant_id: 'enumerate',
        time_complexity: 'O(n²)',
        space_complexity: 'O(1)',
        estimated_runtime_ms: 1180,
        percentile: 'top 14%',
        memory_mb: 1.2,
      },
      {
        variant_id: 'binary_search',
        time_complexity: 'O(n log n)',
        space_complexity: 'O(n)',
        estimated_runtime_ms: 240,
        percentile: 'top 8%',
        memory_mb: 6.8,
      },
    ],
  },
  recommendations: [
    { problem_id: 'LC-015', title: '3Sum', category: 'TwoPointer', difficulty: 'Medium', why_recommended: 'Similar hash-table + two-pointer pattern. Your weak area: Greedy alternatives', success_probability: 0.82 },
    { problem_id: 'LC-454', title: '4Sum II', category: 'HashTable', difficulty: 'Medium', why_recommended: 'Extends hash-table pattern to 4 arrays. Builds on your 92% HashTable strength', success_probability: 0.78 },
    { problem_id: 'LC-001', title: 'Two Sum (optimized)', category: 'HashTable', difficulty: 'Easy', why_recommended: 'Revisit with hash-table approach to reinforce pattern', success_probability: 0.95 },
    { problem_id: 'LC-076', title: 'Minimum Window Substring', category: 'SlidingWindow', difficulty: 'Hard', why_recommended: 'Advanced sliding window — your 82% strength. Stretch goal', success_probability: 0.55 },
    { problem_id: 'LC-055', title: 'Jump Game', category: 'Greedy', difficulty: 'Medium', why_recommended: 'Targets your weakest area (Greedy: 45%). Recommended for balanced growth', success_probability: 0.60 },
  ],
  learning: {
    new_patterns: [
      'Hash table for two-sum variants',
      'Complement lookup pattern',
      'Enumerate with dictionary pattern',
    ],
    strength_updates: { 'HashTable': 93, 'TwoPointer': 89 },
    weak_area_updates: { 'Greedy': 42, 'Heap': 44 },
    templates_extracted: [
      'hash_table_complement_lookup',
      'two_pointer_sorted_search',
    ],
    confidence: 0.92,
  },
  audit: {
    approved: true,
    confidence: 0.94,
    summary: "You excel at hash table solutions (92% success rate). We recommend the O(n) hash table approach here — it matches your strongest algorithm pattern. After 12 two-pointer problems, you've developed strong pattern recognition. Next focus: strengthen your greedy algorithm knowledge (currently 45%).",
    key_insights: [
      'HashTable is your strongest algorithm (92%)',
      'Greedy is your weakest area (45%) — consider practicing',
      'You solve Python problems 2x faster than Java',
      'Your improvement curve is trending upward — consistent growth across 8 weeks',
    ],
    next_steps: [
      'Try HashTable optimized solution for this problem',
      'Practice 3Sum to strengthen TwoPointer + Greedy',
      'Review your 14 past BinarySearch solutions for patterns',
    ],
  },
  patterns: {
    algorithm_type: 'TwoPointer',
    approach: 'brute-force',
    language_match: 0.88,
  },
};

export const agentDefinitions = [
  { id: 1, name: 'Intake Agent', description: 'Parse & validate code submissions', icon: 'ClipboardCheck', color: 'neon-purple' },
  { id: 2, name: 'Pattern Agent', description: 'Extract solving patterns from history', icon: 'BrainCircuit', color: 'neon-cyan' },
  { id: 3, name: 'Analyzer Agent', description: 'Deep complexity & edge case analysis', icon: 'Search', color: 'neon-purple' },
  { id: 4, name: 'Optimizer Agent', description: 'Personalized optimization suggestions', icon: 'Zap', color: 'accent' },
  { id: 5, name: 'Benchmarker Agent', description: 'Compare variants across languages', icon: 'BarChart3', color: 'neon-cyan' },
  { id: 6, name: 'Learning Agent', description: 'Extract patterns, update user profile', icon: 'BookOpen', color: 'neon-purple' },
  { id: 7, name: 'Recommendation Agent', description: 'Adaptive problem suggestions', icon: 'Lightbulb', color: 'neon-cyan' },
  { id: 8, name: 'Auditor Agent', description: 'Final approval + human-readable insights', icon: 'ShieldCheck', color: 'accent' },
];

export const solutionHistoryData = [
  { name: 'Week 1', count: 3, avgPercentile: 45 },
  { name: 'Week 2', count: 5, avgPercentile: 52 },
  { name: 'Week 3', count: 4, avgPercentile: 58 },
  { name: 'Week 4', count: 6, avgPercentile: 55 },
  { name: 'Week 5', count: 7, avgPercentile: 65 },
  { name: 'Week 6', count: 5, avgPercentile: 70 },
  { name: 'Week 7', count: 8, avgPercentile: 75 },
  { name: 'Week 8', count: 6, avgPercentile: 82 },
];
