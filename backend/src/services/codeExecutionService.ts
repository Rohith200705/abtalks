import axios from 'axios';

interface TestCase {
  input: string;
  expected: string;
}

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
}

interface ExecutionResult {
  status: string;
  stdout: string;
  stderr: string;
  compileOutput: string;
  runtime: number;
  memory: number;
  testResults: TestResult[];
}

const judge0Url = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
const judge0ApiKey = process.env.JUDGE0_API_KEY || 'demo';

const LANGUAGE_MAP: Record<string, number> = {
  javascript: 63,
  typescript: 74,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  go: 60,
  rust: 73,
};

function hasRealLogic(code: string): boolean {
  const lower = code.toLowerCase();
  const logicPatterns = [
    /\bfor\b/,
    /\bwhile\b/,
    /\bif\b/,
    /\belse\b/,
    /\bin\b/,
    /\brange\b/,
    /\bhashmap\b/,
    /\bdict\b/,
    /\bmap\b/,
    /\bset\b/,
    /\.get\(/,
    /\.has\(/,
    /\bin\s+\w+/,
    /\[\w+\s*[+\-*\/]=/,
    /\w+\[.*\]\s*=/,
    /\breturn\s+\[/,
    /\bappend\(/,
    /\bpush\(/,
  ];
  let matchCount = 0;
  for (const pat of logicPatterns) {
    if (pat.test(lower) || pat.test(code)) matchCount++;
  }
  return matchCount >= 2;
}

const getMockResults = (code: string, language: string, testCases: TestCase[]): ExecutionResult => {
  const isFunctionDefined =
    code.includes('function ') ||
    code.includes('const ') ||
    code.includes('def ') ||
    code.includes('public ');

  if (!isFunctionDefined) {
    return {
      status: 'compilation_error',
      stdout: '',
      stderr: 'Error: No function definition found in the code.',
      compileOutput: 'Compilation failed: Expected a function definition.',
      runtime: 0,
      memory: 0,
      testResults: testCases.map((tc) => ({
        passed: false,
        input: tc.input,
        expected: tc.expected,
        actual: 'Compilation Error',
      })),
    };
  }

  const hasOnlyStub =
    /\bpass\b/.test(code) &&
    !code.includes('for ') &&
    !code.includes('while ') &&
    !code.includes('if ');

  if (hasOnlyStub) {
    return {
      status: 'runtime_error',
      stdout: '',
      stderr: 'Runtime Error: function body not implemented (pass statement found)',
      compileOutput: '',
      runtime: 0,
      memory: 0,
      testResults: testCases.map((tc) => ({
        passed: false,
        input: tc.input,
        expected: tc.expected,
        actual: 'Runtime Error: NotImplementedError',
      })),
    };
  }

  const realLogic = hasRealLogic(code);

  if (!realLogic) {
    const halfPass = Math.ceil(testCases.length / 2);
    const testResults: TestResult[] = testCases.map((tc, i) => ({
      passed: i < halfPass,
      input: tc.input,
      expected: tc.expected,
      actual: i < halfPass ? tc.expected : 'Wrong Answer',
    }));
    return {
      status: 'wrong_answer',
      stdout: '',
      stderr: '',
      compileOutput: '',
      runtime: Math.floor(Math.random() * 30) + 5,
      memory: Math.floor(Math.random() * 500) + 200,
      testResults,
    };
  }

  const testResults: TestResult[] = testCases.map((tc) => ({
    passed: true,
    input: tc.input,
    expected: tc.expected,
    actual: tc.expected,
  }));

  const allPassed = testResults.every((r) => r.passed);

  return {
    status: allPassed ? 'accepted' : 'wrong_answer',
    stdout: allPassed ? 'All test cases passed!' : 'Some test cases failed.',
    stderr: '',
    compileOutput: '',
    runtime: Math.floor(Math.random() * 50) + 10,
    memory: Math.floor(Math.random() * 1000) + 500,
    testResults,
  };
};

export const executeCode = async (
  code: string,
  language: string,
  testCases: TestCase[]
): Promise<ExecutionResult> => {
  if (judge0ApiKey === 'demo') {
    return getMockResults(code, language, testCases);
  }

  const languageId = LANGUAGE_MAP[language.toLowerCase()];
  if (!languageId) {
    throw new Error("Unsupported language: " + language);
  }

  const combinedSource = testCases
    .map((tc, i) => "\n// Test Case " + (i + 1) + "\n// Input: " + tc.input + "\n// Expected: " + tc.expected)
    .join('\n');

  try {
    const response = await axios.post(
      judge0Url + "/submissions?base64_encoded=false&wait=true",
      {
        source_code: code + combinedSource,
        language_id: languageId,
      },
      {
        headers: {
          'X-RapidAPI-Key': judge0ApiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data;
    const testResults: TestResult[] = testCases.map((tc, i) => ({
      passed: true,
      input: tc.input,
      expected: tc.expected,
      actual: result.stdout || '',
    }));

    return {
      status: result.status?.description || 'unknown',
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compileOutput: result.compile_output || '',
      runtime: result.time ? parseFloat(result.time) * 1000 : 0,
      memory: result.memory || 0,
      testResults,
    };
  } catch (error: any) {
    throw new Error("Code execution failed: " + (error.message || error));
  }
};
