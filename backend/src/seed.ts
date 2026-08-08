import mongoose, { Types } from 'mongoose';
import { env } from './config/env';
import { User } from './models/User';
import { Challenge } from './models/Challenge';
import { Progress } from './models/Progress';
import { Achievement } from './models/Achievement';

const oid = (id: string) => new Types.ObjectId(id);

const demoUserId = oid('65a1b2c3d4e5f6a7b8c9d0e1');

// ============================================================
// CHALLENGES
// ============================================================

const challenges: any[] = [
  // --- Day 1: Two Sum ---
  {
    day: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    topics: ['Arrays', 'Hash Map'],
    description:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].' },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      python: 'from typing import List\n\ndef twoSum(nums: List[int], target: int) -> List[int]:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
      { input: '[3,3]\n6', expectedOutput: '[0,1]' },
      { input: '[1,2,3,4,5]\n9', expectedOutput: '[3,4]' },
    ],
    solvedPercentage: 82,
    order: 1,
  },
  // --- Day 2: Valid Parentheses ---
  {
    day: 2,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'easy',
    topics: ['Stack', 'String'],
    description:
      'Given a string `s` containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      { input: 's = "()"', output: 'true', explanation: 'The string has one pair of matching parentheses.' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'All brackets are properly matched and closed in order.' },
      { input: 's = "(]"', output: 'false', explanation: 'The round bracket "(" is closed by a square bracket "]", which is invalid.' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\''],
    starterCode: {
      python: 'def isValid(s: str) -> bool:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '()', expectedOutput: 'true' },
      { input: '()[]{}', expectedOutput: 'true' },
      { input: '(]', expectedOutput: 'false' },
      { input: '{[]}', expectedOutput: 'true' },
    ],
    solvedPercentage: 75,
    order: 2,
  },

  // --- Day 3: Reverse String ---
  {
    day: 3,
    title: 'Reverse String',
    slug: 'reverse-string',
    difficulty: 'easy',
    topics: ['String', 'Two Pointers'],
    description: 'Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: 'The array is reversed in-place.' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', explanation: 'The array is reversed in-place.' },
      { input: 's = ["A","B","C"]', output: '["C","B","A"]', explanation: 'The array is reversed in-place.' },
    ],
    constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ascii character.'],
    starterCode: {
      python: 'from typing import List\n\ndef reverseString(s: List[str]) -> None:\n    """\n    Do not return anything, modify s in-place instead.\n    """\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {character[]} s\n * @return {void} Do not return anything, modify s in-place instead.\n */\nvar reverseString = function(s) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' },
      { input: '["A"]', expectedOutput: '["A"]' },
    ],
    solvedPercentage: 90,
    order: 3,
  },

  // --- Day 4: Maximum Subarray ---
  {
    day: 4,
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'medium',
    topics: ['Array', 'Dynamic Programming'],
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1', explanation: 'The subarray [1] has the largest sum 1.' },
      { input: 'nums = [5,4,-1,7,8]', output: '23', explanation: 'The subarray [5,4,-1,7,8] has the largest sum 23.' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: {
      python: 'from typing import List\n\ndef maxSubArray(nums: List[int]) -> int:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {number[]} nums\n * @return {number}\n */\nvar maxSubArray = function(nums) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23' },
      { input: '[-1]', expectedOutput: '-1' },
    ],
    solvedPercentage: 55,
    order: 4,
  },
  // --- Day 5: Linked List Cycle ---
  {
    day: 5,
    title: 'Linked List Cycle',
    slug: 'linked-list-cycle',
    difficulty: 'easy',
    topics: ['Linked List', 'Two Pointers'],
    description: 'Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`.',
    examples: [
      { input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).' },
      { input: 'head = [1,2], pos = 0', output: 'true', explanation: 'There is a cycle in the linked list, where the tail connects to the 0th node.' },
      { input: 'head = [1], pos = -1', output: 'false', explanation: 'There is no cycle in the linked list.' },
    ],
    constraints: ['The number of the nodes in the list is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5', 'pos is -1 or a valid index in the linked-list.'],
    starterCode: {
      python: 'from typing import Optional\n\nclass ListNode:\n    def __init__(self, x):\n        self.val = x\n        self.next = None\n\ndef hasCycle(head: Optional[ListNode]) -> bool:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {ListNode} head\n * @return {boolean}\n */\nvar hasCycle = function(head) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[3,2,0,-4]\n1', expectedOutput: 'true' },
      { input: '[1,2]\n0', expectedOutput: 'true' },
      { input: '[1]\n-1', expectedOutput: 'false' },
      { input: '[1]\n0', expectedOutput: 'true' },
    ],
    solvedPercentage: 68,
    order: 5,
  },

  // --- Day 6: Binary Search ---
  {
    day: 6,
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'easy',
    topics: ['Array', 'Binary Search'],
    description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with O(log n) runtime complexity.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1.' },
      { input: 'nums = [5], target = 5', output: '0', explanation: '5 exists in nums and its index is 0.' },
    ],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All the integers in nums are unique.', 'nums is sorted in ascending order.'],
    starterCode: {
      python: 'from typing import List\n\ndef search(nums: List[int], target: int) -> int:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nvar search = function(nums, target) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[-1,0,3,5,9,12]\n9', expectedOutput: '4' },
      { input: '[-1,0,3,5,9,12]\n2', expectedOutput: '-1' },
      { input: '[5]\n5', expectedOutput: '0' },
      { input: '[-1,0,2,4,6,8]\n4', expectedOutput: '3' },
    ],
    solvedPercentage: 78,
    order: 6,
  },

  // --- Day 7: Merge Intervals ---
  {
    day: 7,
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'medium',
    topics: ['Array', 'Sorting'],
    description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' },
      { input: 'intervals = [[1,4],[0,4]]', output: '[[0,4]]', explanation: 'Intervals [1,4] and [0,4] overlap and merge to [0,4].' },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    starterCode: {
      python: 'from typing import List\n\ndef merge(intervals: List[List[int]]) -> List[List[int]]:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nvar merge = function(intervals) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' },
      { input: '[[1,4],[0,4]]', expectedOutput: '[[0,4]]' },
      { input: '[[1,4],[2,3]]', expectedOutput: '[[1,4]]' },
    ],
    solvedPercentage: 48,
    order: 7,
  },
  // --- Day 8: Valid Sudoku ---
  {
    day: 8,
    title: 'Valid Sudoku',
    slug: 'valid-sudoku',
    difficulty: 'medium',
    topics: ['Hash Map', 'Matrix'],
    description: 'Determine if a `9 x 9` Sudoku board is valid. Only the filled cells need to be validated according to the following rules:\n\n1. Each row must contain the digits `1-9` without repetition.\n2. Each column must contain the digits `1-9` without repetition.\n3. Each of the nine `3 x 3` sub-boxes of the grid must contain the digits `1-9` without repetition.\n\nNote:\n- A Sudoku board (partially filled) could be valid but is not necessarily solvable.\n- Only the filled cells need to be validated according to the mentioned rules.',
    examples: [
      { input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]', output: 'true', explanation: 'Every row, column, and 3x3 sub-box contains unique digits 1-9.' },
      { input: 'board = [["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]', output: 'false', explanation: 'There are two 8\'s in the top-left 3x3 sub-box, which is invalid.' },
      { input: 'board = [["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"]]', output: 'false', explanation: 'Each row contains duplicate digits.' },
    ],
    constraints: ['board.length == 9', 'board[i].length == 9', 'board[i][j] is a digit 1-9 or \'.\''],
    starterCode: {
      python: 'from typing import List\n\ndef isValidSudoku(board: List[List[str]]) -> bool:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {character[][]} board\n * @return {boolean}\n */\nvar isValidSudoku = function(board) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    bool isValidSudoku(vector<vector<char>>& board) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]', expectedOutput: 'true' },
      { input: '[["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]', expectedOutput: 'false' },
      { input: '[["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"],["1","2","3","4","5","6","7","8","9"]]', expectedOutput: 'false' },
    ],
    solvedPercentage: 52,
    order: 8,
  },

  // --- Day 9: Climbing Stairs ---
  {
    day: 9,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'easy',
    topics: ['Dynamic Programming', 'Math'],
    description: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways: 1) 1 step + 1 step, 2) 2 steps.' },
      { input: 'n = 3', output: '3', explanation: 'There are three ways: 1) 1+1+1, 2) 1+2, 3) 2+1.' },
      { input: 'n = 5', output: '8', explanation: 'There are 8 distinct ways to climb 5 stairs.' },
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      python: 'def climbStairs(n: int) -> int:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {number} n\n * @return {number}\n */\nvar climbStairs = function(n) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '5', expectedOutput: '8' },
      { input: '10', expectedOutput: '89' },
    ],
    solvedPercentage: 72,
    order: 9,
  },
  // --- Day 10: Best Time to Buy and Sell Stock ---
  {
    day: 10,
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'easy',
    topics: ['Array', 'Dynamic Programming'],
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and the max profit = 0.' },
      { input: 'prices = [2,4,1]', output: '2', explanation: 'Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4 - 2 = 2.' },
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    starterCode: {
      python: 'from typing import List\n\ndef maxProfit(prices: List[int]) -> int:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {number[]} prices\n * @return {number}\n */\nvar maxProfit = function(prices) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
      { input: '[7,6,4,3,1]', expectedOutput: '0' },
      { input: '[2,4,1]', expectedOutput: '2' },
      { input: '[1,2]', expectedOutput: '1' },
    ],
    solvedPercentage: 65,
    order: 10,
  },

  // --- Day 11: Number of Islands ---
  {
    day: 11,
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'medium',
    topics: ['Graph', 'BFS', 'DFS'],
    description: 'Given an `m x n` 2D binary grid `grid` which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1', explanation: 'There is only one island in the grid.' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3', explanation: 'There are 3 islands: one in the top-left, one in the middle, and one in the bottom-right.' },
      { input: 'grid = [["1","0","1"],["0","1","0"],["1","0","1"]]', output: '5', explanation: 'Each land cell is isolated, forming 5 separate islands.' },
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is \'0\' or \'1\'.'],
    starterCode: {
      python: 'from typing import List\n\ndef numIslands(grid: List[List[str]]) -> int:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {character[][]} grid\n * @return {number}\n */\nvar numIslands = function(grid) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1' },
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3' },
      { input: '[["1","0","1"],["0","1","0"],["1","0","1"]]', expectedOutput: '5' },
    ],
    solvedPercentage: 45,
    order: 11,
  },

  // --- Day 12: Two Sum (demo day) ---
  {
    day: 12,
    title: 'Two Sum',
    slug: 'two-sum-ii',
    difficulty: 'easy',
    topics: ['Arrays', 'Hash Map'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n**Challenge:** Can you solve this in O(n) time complexity using a hash map?',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    starterCode: {
      python: 'from typing import List\n\ndef twoSum(nums: List[int], target: int) -> List[int]:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
      { input: '[3,3]\n6', expectedOutput: '[0,1]' },
      { input: '[-1,-2,-3,-4,-5]\n-8', expectedOutput: '[2,4]' },
    ],
    solvedPercentage: 82,
    order: 12,
  },
  // --- Day 13: Longest Substring Without Repeating Characters ---
  {
    day: 13,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'medium',
    topics: ['String', 'Sliding Window'],
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3. Note that "pwke" is a substring but not a contiguous sequence of characters.' },
      { input: 's = ""', output: '0', explanation: 'An empty string has no substrings.' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    starterCode: {
      python: 'def lengthOfLongestSubstring(s: str) -> int:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '"abcabcbb"', expectedOutput: '3' },
      { input: '"bbbbb"', expectedOutput: '1' },
      { input: '"pwwkew"', expectedOutput: '3' },
      { input: '""', expectedOutput: '0' },
    ],
    solvedPercentage: 42,
    order: 13,
  },

  // --- Day 14: Reverse Linked List ---
  {
    day: 14,
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'easy',
    topics: ['Linked List'],
    description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'The linked list is reversed.' },
      { input: 'head = [1,2]', output: '[2,1]', explanation: 'The linked list with two nodes is reversed.' },
      { input: 'head = []', output: '[]', explanation: 'An empty list remains empty when reversed.' },
      { input: 'head = [1]', output: '[1]', explanation: 'A single node list remains the same.' },
    ],
    constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    starterCode: {
      python: 'from typing import Optional\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverseList(head: Optional[ListNode]) -> Optional[ListNode]:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nvar reverseList = function(head) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
      { input: '[1,2]', expectedOutput: '[2,1]' },
      { input: '[]', expectedOutput: '[]' },
      { input: '[1]', expectedOutput: '[1]' },
    ],
    solvedPercentage: 80,
    order: 14,
  },

  // --- Day 15: Minimum Depth of Binary Tree ---
  {
    day: 15,
    title: 'Minimum Depth of Binary Tree',
    slug: 'minimum-depth-of-binary-tree',
    difficulty: 'easy',
    topics: ['Tree', 'BFS'],
    description: 'Given a binary tree, find its minimum depth.\n\nThe minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.\n\nNote: A leaf is a node with no children.',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '2', explanation: 'The shortest path is 3 -> 9, which has length 2.' },
      { input: 'root = [2,null,3,null,4,null,5,null,6]', output: '5', explanation: 'The shortest path is 2 -> 3 -> 4 -> 5 -> 6, which has length 5.' },
      { input: 'root = [1]', output: '1', explanation: 'A single node tree has minimum depth 1.' },
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 10^5].', '-1000 <= Node.val <= 1000'],
    starterCode: {
      python: 'from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef minDepth(root: Optional[TreeNode]) -> int:\n    # Write your solution here\n    pass',
      javascript: '/**\n * @param {TreeNode} root\n * @return {number}\n */\nvar minDepth = function(root) {\n    // Write your solution here\n};',
      cpp: 'class Solution {\npublic:\n    int minDepth(TreeNode* root) {\n        // Write your solution here\n    }\n};',
    },
    testCases: [
      { input: '[3,9,20,null,null,15,7]', expectedOutput: '2' },
      { input: '[2,null,3,null,4,null,5,null,6]', expectedOutput: '5' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[]', expectedOutput: '0' },
    ],
    solvedPercentage: 58,
    order: 15,
  },
];

// ============================================================
// USERS
// ============================================================

const demoUser = {
  _id: demoUserId,
  name: 'Rohith',
  username: 'rohith',
  email: 'rohith@abtalks.dev',
  avatar: '',
  bio: 'Passionate developer on a 60-day coding journey',
  college: 'IIIT Hyderabad',
  graduationYear: 2025,
  createdAt: new Date('2025-01-01'),
};

const leaderboardUsers: any[] = [
  {
    _id: oid('65a1b2c3d4e5f6a7b8c9d0e2'),
    name: 'Priya',
    username: 'priya',
    email: 'priya@abtalks.dev',
    avatar: '',
    bio: 'Full-stack developer and problem solver',
    college: 'IIT Bombay',
    graduationYear: 2024,
    createdAt: new Date('2024-12-15'),
  },
  {
    _id: oid('65a1b2c3d4e5f6a7b8c9d0e3'),
    name: 'Arjun',
    username: 'arjun',
    email: 'arjun@abtalks.dev',
    avatar: '',
    bio: 'Passionate about algorithms and system design',
    college: 'IIT Delhi',
    graduationYear: 2025,
    createdAt: new Date('2024-12-20'),
  },
  {
    _id: oid('65a1b2c3d4e5f6a7b8c9d0e4'),
    name: 'Sneha',
    username: 'sneha',
    email: 'sneha@abtalks.dev',
    avatar: '',
    bio: 'Love solving puzzles and coding challenges',
    college: 'NIT Trichy',
    graduationYear: 2025,
    createdAt: new Date('2025-01-02'),
  },
  {
    _id: oid('65a1b2c3d4e5f6a7b8c9d0e5'),
    name: 'Vikram',
    username: 'vikram',
    email: 'vikram@abtalks.dev',
    avatar: '',
    bio: 'Competitive programmer and tech enthusiast',
    college: 'BITS Pilani',
    graduationYear: 2024,
    createdAt: new Date('2024-12-25'),
  },
  {
    _id: oid('65a1b2c3d4e5f6a7b8c9d0e6'),
    name: 'Ananya',
    username: 'ananya',
    email: 'ananya@abtalks.dev',
    avatar: '',
    bio: 'Aspiring software engineer',
    college: 'IIIT Bangalore',
    graduationYear: 2026,
    createdAt: new Date('2025-01-05'),
  },
  {
    _id: oid('65a1b2c3d4e5f6a7b8c9d0e7'),
    name: 'Karthik',
    username: 'karthik',
    email: 'karthik@abtalks.dev',
    avatar: '',
    bio: 'Building things one line at a time',
    college: 'VIT Vellore',
    graduationYear: 2025,
    createdAt: new Date('2025-01-03'),
  },
  {
    _id: oid('65a1b2c3d4e5f6a7b8c9d0e8'),
    name: 'Divya',
    username: 'divya',
    email: 'divya@abtalks.dev',
    avatar: '',
    bio: 'Data structures and algorithms enthusiast',
    college: 'SRM University',
    graduationYear: 2025,
    createdAt: new Date('2025-01-04'),
  },
  {
    _id: oid('65a1b2c3d4e5f6a7b8c9d0e9'),
    name: 'Rahul',
    username: 'rahul',
    email: 'rahul@abtalks.dev',
    avatar: '',
    bio: 'Exploring the world of coding',
    college: 'Manipal Institute of Technology',
    graduationYear: 2026,
    createdAt: new Date('2025-01-06'),
  },
  {
    _id: oid('65a1b2c3d4e5f6a7b8c9d0ea'),
    name: 'Meera',
    username: 'meera',
    email: 'meera@abtalks.dev',
    avatar: '',
    bio: 'Learning and growing every day',
    college: 'NIT Warangal',
    graduationYear: 2025,
    createdAt: new Date('2025-01-07'),
  },
];

// ============================================================
// PROGRESS
// ============================================================

const progressRecords: any[] = [
  {
    userId: demoUserId,
    currentDay: 12,
    completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    streak: 11,
    longestStreak: 11,
    xp: 2840,
    rank: 5,
    selectedTrack: 'general',
    totalSolved: 11,
    easySolved: 8,
    mediumSolved: 3,
    hardSolved: 0,
    lastActivityAt: new Date(),
  },
  {
    userId: oid('65a1b2c3d4e5f6a7b8c9d0e2'),
    currentDay: 25,
    completedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
    streak: 25,
    longestStreak: 25,
    xp: 4200,
    rank: 1,
    selectedTrack: 'general',
    totalSolved: 24,
    easySolved: 16,
    mediumSolved: 7,
    hardSolved: 1,
    lastActivityAt: new Date(),
  },
  {
    userId: oid('65a1b2c3d4e5f6a7b8c9d0e3'),
    currentDay: 20,
    completedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
    streak: 20,
    longestStreak: 20,
    xp: 3800,
    rank: 2,
    selectedTrack: 'general',
    totalSolved: 19,
    easySolved: 12,
    mediumSolved: 6,
    hardSolved: 1,
    lastActivityAt: new Date(),
  },
  {
    userId: oid('65a1b2c3d4e5f6a7b8c9d0e4'),
    currentDay: 18,
    completedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
    streak: 18,
    longestStreak: 18,
    xp: 3500,
    rank: 3,
    selectedTrack: 'general',
    totalSolved: 17,
    easySolved: 10,
    mediumSolved: 6,
    hardSolved: 1,
    lastActivityAt: new Date(),
  },
  {
    userId: oid('65a1b2c3d4e5f6a7b8c9d0e5'),
    currentDay: 15,
    completedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
    streak: 15,
    longestStreak: 15,
    xp: 3200,
    rank: 4,
    selectedTrack: 'general',
    totalSolved: 14,
    easySolved: 9,
    mediumSolved: 4,
    hardSolved: 1,
    lastActivityAt: new Date(),
  },
  {
    userId: oid('65a1b2c3d4e5f6a7b8c9d0e6'),
    currentDay: 14,
    completedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13],
    streak: 14,
    longestStreak: 14,
    xp: 2600,
    rank: 6,
    selectedTrack: 'general',
    totalSolved: 13,
    easySolved: 8,
    mediumSolved: 5,
    hardSolved: 0,
    lastActivityAt: new Date(),
  },
  {
    userId: oid('65a1b2c3d4e5f6a7b8c9d0e7'),
    currentDay: 12,
    completedDays: [1,2,3,4,5,6,7,8,9,10,11],
    streak: 12,
    longestStreak: 12,
    xp: 2400,
    rank: 7,
    selectedTrack: 'general',
    totalSolved: 11,
    easySolved: 7,
    mediumSolved: 4,
    hardSolved: 0,
    lastActivityAt: new Date(),
  },
  {
    userId: oid('65a1b2c3d4e5f6a7b8c9d0e8'),
    currentDay: 10,
    completedDays: [1,2,3,4,5,6,7,8,9],
    streak: 10,
    longestStreak: 10,
    xp: 2100,
    rank: 8,
    selectedTrack: 'general',
    totalSolved: 9,
    easySolved: 6,
    mediumSolved: 3,
    hardSolved: 0,
    lastActivityAt: new Date(),
  },
  {
    userId: oid('65a1b2c3d4e5f6a7b8c9d0e9'),
    currentDay: 8,
    completedDays: [1,2,3,4,5,6,7],
    streak: 8,
    longestStreak: 8,
    xp: 1800,
    rank: 9,
    selectedTrack: 'general',
    totalSolved: 7,
    easySolved: 5,
    mediumSolved: 2,
    hardSolved: 0,
    lastActivityAt: new Date(),
  },
  {
    userId: oid('65a1b2c3d4e5f6a7b8c9d0ea'),
    currentDay: 7,
    completedDays: [1,2,3,4,5,6],
    streak: 7,
    longestStreak: 7,
    xp: 1500,
    rank: 10,
    selectedTrack: 'general',
    totalSolved: 6,
    easySolved: 4,
    mediumSolved: 2,
    hardSolved: 0,
    lastActivityAt: new Date(),
  },
];

// ============================================================
// ACHIEVEMENTS (for demo user)
// ============================================================

const demoAchievements: any[] = [
  {
    userId: demoUserId,
    type: 'first_challenge',
    title: 'First Steps',
    description: 'Solved your first challenge',
    day: 1,
    xp: 50,
    imageUrl: '',
    unlockedAt: new Date('2025-01-02'),
    linkedinPostId: '',
  },
  {
    userId: demoUserId,
    type: 'week_one_complete',
    title: 'Week Warrior',
    description: 'Completed your first week',
    day: 7,
    xp: 200,
    imageUrl: '',
    unlockedAt: new Date('2025-01-08'),
    linkedinPostId: '',
  },
  {
    userId: demoUserId,
    type: '7_day_streak',
    title: 'Streak Master',
    description: 'Maintained a 7-day streak',
    day: 7,
    xp: 150,
    imageUrl: '',
    unlockedAt: new Date('2025-01-08'),
    linkedinPostId: '',
  },
  {
    userId: demoUserId,
    type: '10_challenges',
    title: 'Double Digits',
    description: 'Solved 10 challenges',
    day: 10,
    xp: 300,
    imageUrl: '',
    unlockedAt: new Date('2025-01-11'),
    linkedinPostId: '',
  },
];

// ============================================================
// SEED FUNCTION
// ============================================================

async function seed(): Promise<void> {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear all existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Challenge.deleteMany({});
    await Progress.deleteMany({});
    await Achievement.deleteMany({});
    console.log('Cleared all existing data');

    // Seed challenges
    console.log('Seeding challenges...');
    const createdChallenges = await Challenge.insertMany(challenges);
    console.log(`Created ${createdChallenges.length} challenges`);

    // Seed demo user
    console.log('Seeding demo user...');
    await User.create(demoUser);
    console.log('Created demo user: Rohith');

    // Seed leaderboard users
    console.log('Seeding leaderboard users...');
    const createdUsers = await User.insertMany(leaderboardUsers);
    console.log(`Created ${createdUsers.length} leaderboard users`);

    // Seed progress records
    console.log('Seeding progress records...');
    const createdProgress = await Progress.insertMany(progressRecords);
    console.log(`Created ${createdProgress.length} progress records`);

    // Seed demo user achievements
    console.log('Seeding achievements...');
    const createdAchievements = await Achievement.insertMany(demoAchievements);
    console.log(`Created ${createdAchievements.length} achievements`);

    console.log('');
    console.log('=== Seed Complete! ===');
    console.log(`  Users: ${1 + leaderboardUsers.length}`);
    console.log(`  Challenges: ${challenges.length}`);
    console.log(`  Progress records: ${progressRecords.length}`);
    console.log(`  Achievements: ${demoAchievements.length}`);
    console.log('');
    console.log('Demo user login: rohith@abtalks.dev');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (disconnectError) {
      console.error('Error disconnecting:', disconnectError);
    }
  }
}

seed();
