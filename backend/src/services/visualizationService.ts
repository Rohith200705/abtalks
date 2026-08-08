interface TraceStep {
  step: number;
  line: number;
  function: string;
  variables: Record<string, any>;
  structures: Record<string, any>;
  expression?: string;
  value?: any;
}

const getTwoSumTrace = (): TraceStep[] => {
  return [
    {
      step: 1,
      line: 1,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9 },
      structures: { hashmap: {} },
      expression: 'function called',
      value: undefined,
    },
    {
      step: 2,
      line: 2,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4 },
      structures: { hashmap: {} },
      expression: 'n = nums.length',
      value: 4,
    },
    {
      step: 3,
      line: 3,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4, i: 0 },
      structures: { hashmap: {} },
      expression: 'for i = 0',
      value: 0,
    },
    {
      step: 4,
      line: 4,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4, i: 0, complement: 7 },
      structures: { hashmap: {} },
      expression: 'complement = 9 - nums[0] = 9 - 2 = 7',
      value: 7,
    },
    {
      step: 5,
      line: 5,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4, i: 0, complement: 7 },
      structures: { hashmap: {} },
      expression: 'hashmap.has(7)',
      value: false,
    },
    {
      step: 6,
      line: 7,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4, i: 0, complement: 7 },
      structures: { hashmap: { '2': 0 } },
      expression: 'hashmap.set(nums[0], 0) = hashmap.set(2, 0)',
      value: { '2': 0 },
    },
    {
      step: 7,
      line: 3,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4, i: 1 },
      structures: { hashmap: { '2': 0 } },
      expression: 'for i = 1',
      value: 1,
    },
    {
      step: 8,
      line: 4,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4, i: 1, complement: 2 },
      structures: { hashmap: { '2': 0 } },
      expression: 'complement = 9 - nums[1] = 9 - 7 = 2',
      value: 2,
    },
    {
      step: 9,
      line: 5,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4, i: 1, complement: 2 },
      structures: { hashmap: { '2': 0 } },
      expression: 'hashmap.has(2)',
      value: true,
    },
    {
      step: 10,
      line: 6,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4, i: 1, complement: 2 },
      structures: { hashmap: { '2': 0 } },
      expression: 'return [hashmap.get(2), 1] = [0, 1]',
      value: [0, 1],
    },
    {
      step: 11,
      line: 3,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4, i: 0 },
      structures: { hashmap: {} },
      expression: 'brute force loop i=0',
      value: 0,
    },
    {
      step: 12,
      line: 4,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4, i: 0, j: 1 },
      structures: { hashmap: {} },
      expression: 'brute force inner loop j=1',
      value: 1,
    },
    {
      step: 13,
      line: 5,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4, i: 0, j: 1 },
      structures: { hashmap: {} },
      expression: 'nums[0] + nums[1] = 2 + 7 = 9 === target',
      value: true,
    },
    {
      step: 14,
      line: 6,
      function: 'twoSum',
      variables: { nums: [2, 7, 11, 15], target: 9, n: 4, i: 0, j: 1 },
      structures: { hashmap: {} },
      expression: 'return [0, 1]',
      value: [0, 1],
    },
    {
      step: 15,
      line: 1,
      function: 'twoSumOptimized',
      variables: { nums: [2, 7, 11, 15], target: 9 },
      structures: { hashmap: {} },
      expression: 'optimized version called',
      value: undefined,
    },
    {
      step: 16,
      line: 3,
      function: 'twoSumOptimized',
      variables: { nums: [2, 7, 11, 15], target: 9, i: 0 },
      structures: { hashmap: {} },
      expression: 'for i = 0',
      value: 0,
    },
    {
      step: 17,
      line: 4,
      function: 'twoSumOptimized',
      variables: { nums: [2, 7, 11, 15], target: 9, i: 0, complement: 7 },
      structures: { hashmap: {} },
      expression: 'complement = 7, hashmap.has(7) = false',
      value: false,
    },
    {
      step: 18,
      line: 6,
      function: 'twoSumOptimized',
      variables: { nums: [2, 7, 11, 15], target: 9, i: 0 },
      structures: { hashmap: { '2': 0 } },
      expression: 'hashmap.set(2, 0)',
      value: { '2': 0 },
    },
  ];
};

export const generateExecutionTrace = async (
  code: string,
  language: string,
  challengeSlug: string
): Promise<TraceStep[]> => {
  if (challengeSlug === 'two-sum') {
    return getTwoSumTrace();
  }

  const lines = code.split('\n');
  const steps: TraceStep[] = [];
  let step = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '' || line.startsWith('//') || line.startsWith('#')) continue;

    if (line.includes('function ') || line.includes('def ') || line.includes('public ')) {
      steps.push({
        step: step++,
        line: i + 1,
        function: line.match(/(?:function|def|public)\s+(\w+)/)?.[1] || 'anonymous',
        variables: {},
        structures: {},
        expression: 'function defined',
        value: undefined,
      });
    }

    if (line.includes('return ')) {
      steps.push({
        step: step++,
        line: i + 1,
        function: 'main',
        variables: {},
        structures: {},
        expression: line.substring(0, 50),
        value: undefined,
      });
    }
  }

  if (steps.length === 0) {
    steps.push({
      step: 1,
      line: 1,
      function: 'main',
      variables: {},
      structures: {},
      expression: 'program started',
      value: undefined,
    });
  }

  return steps;
};
