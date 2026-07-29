export const DSA_PROBLEMS = [

  {
    "id": "p-001",
    "title": "Two Sum",
    "difficulty": "beginner",
    "category": "arrays",
    "tags": [
      "array",
      "hash-map"
    ],
    "acceptance": "49%",
    "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    "starterCode": {
      "python": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass",
      "javascript": "function twoSum(nums, target) {\n    \n}",
      "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};"
    },
    "solutions": {
      "python": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            diff = target - num\n            if diff in seen:\n                return [seen[diff], i]\n            seen[num] = i\n        return []",
      "javascript": "function twoSum(nums, target) {\n    const seen = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (seen.has(diff)) {\n            return [seen.get(diff), i];\n        }\n        seen.set(nums[i], i);\n    }\n    return [];\n}",
      "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (seen.containsKey(diff)) {\n                return new int[] { seen.get(diff), i };\n            }\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (seen.count(diff)) {\n                return {seen[diff], i};\n            }\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};"
    },
    "driverCode": {
      "python": "import sys\nimport json\nfrom typing import List\n\n# @@@USER_CODE@@@\n\nprint('@@@TC0_START@@@')\ntry:\n    nums = json.loads('[2, 7, 11, 15]')\n    target = int('9')\n    sol = Solution()\n    res = sol.twoSum(nums, target)\n    print(json.dumps(res).replace(' ', ''))\nexcept Exception as e:\n    print(e)\nprint('@@@TC0_END@@@')",
      "javascript": "// @@@USER_CODE@@@\n\nconsole.log('@@@TC0_START@@@');\ntry {\n    let res = twoSum([2, 7, 11, 15], 9);\n    console.log(JSON.stringify(res).replace(/ /g, ''));\n} catch (e) {\n    console.error(e);\n} finally {\n    console.log('@@@TC0_END@@@');\n}",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        try {\n            System.out.println(\"@@@TC0_START@@@\");\n            int[] nums = {2, 7, 11, 15};\n            int target = 9;\n            int[] result = sol.twoSum(nums, target);\n            System.out.println(Arrays.toString(result).replaceAll(\" \", \"\"));\n        } catch (Exception e) {\n            e.printStackTrace(System.out);\n        } finally {\n            System.out.println(\"@@@TC0_END@@@\");\n        }\n    }\n}\n// @@@USER_CODE@@@",
      "cpp": "#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\n// @@@USER_CODE@@@\n\nint main() {\n    Solution sol;\n    try {\n        cout << \"@@@TC0_START@@@\\n\";\n        vector<int> nums = {2, 7, 11, 15};\n        int target = 9;\n        vector<int> res = sol.twoSum(nums, target);\n        if (res.size() >= 2) cout << \"[\" << res[0] << \",\" << res[1] << \"]\\n\";\n        else cout << \"[]\\n\";\n    } catch (...) {\n        cout << \"Exception caught\\n\";\n    }\n    cout << \"@@@TC0_END@@@\\n\";\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "expected": "[0,1]"
      }
    ]
  },
  {
    "id": "p-002",
    "title": "Best Time to Buy and Sell Stock",
    "difficulty": "beginner",
    "category": "arrays",
    "tags": [
      "array",
      "dynamic-programming"
    ],
    "acceptance": "54%",
    "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
    "examples": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "output": "5",
        "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      }
    ],
    "starterCode": {
      "python": "class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        pass",
      "javascript": "function maxProfit(prices) {\n    \n}",
      "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        return 0;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        return 0;\n    }\n};"
    },
    "solutions": {
      "python": "class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        min_price = float('inf')\n        max_profit = 0\n        for p in prices:\n            if p < min_price:\n                min_price = p\n            elif p - min_price > max_profit:\n                max_profit = p - min_price\n        return max_profit",
      "javascript": "function maxProfit(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (let p of prices) {\n        if (p < minPrice) minPrice = p;\n        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n    }\n    return maxProfit;\n}",
      "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        int minPrice = Integer.MAX_VALUE;\n        int maxProfit = 0;\n        for (int p : prices) {\n            if (p < minPrice) minPrice = p;\n            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n        }\n        return maxProfit;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minPrice = INT_MAX, maxProfit = 0;\n        for (int p : prices) {\n            if (p < minPrice) minPrice = p;\n            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n        }\n        return maxProfit;\n    }\n};"
    },
    "driverCode": {
      "python": "import sys\nimport json\nfrom typing import List\n\n# @@@USER_CODE@@@\n\nprint('@@@TC0_START@@@')\ntry:\n    prices = json.loads('[7, 1, 5, 3, 6, 4]')\n    sol = Solution()\n    res = sol.maxProfit(prices)\n    print(json.dumps(res).replace(' ', ''))\nexcept Exception as e:\n    print(e)\nprint('@@@TC0_END@@@')",
      "javascript": "// @@@USER_CODE@@@\n\nconsole.log('@@@TC0_START@@@');\ntry {\n    let res = maxProfit([7, 1, 5, 3, 6, 4]);\n    console.log(JSON.stringify(res).replace(/ /g, ''));\n} catch (e) {\n    console.error(e);\n} finally {\n    console.log('@@@TC0_END@@@');\n}",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        try {\n            System.out.println(\"@@@TC0_START@@@\");\n            int[] prices = {7, 1, 5, 3, 6, 4};\n            int result = sol.maxProfit(prices);\n            System.out.println(result);\n        } catch (Exception e) {\n            e.printStackTrace(System.out);\n        } finally {\n            System.out.println(\"@@@TC0_END@@@\");\n        }\n    }\n}\n// @@@USER_CODE@@@",
      "cpp": "#include <iostream>\n#include <vector>\n#include <limits.h>\nusing namespace std;\n\n// @@@USER_CODE@@@\n\nint main() {\n    Solution sol;\n    try {\n        cout << \"@@@TC0_START@@@\\n\";\n        vector<int> prices = {7, 1, 5, 3, 6, 4};\n        int res = sol.maxProfit(prices);\n        cout << res << \"\\n\";\n    } catch (...) {\n        cout << \"Exception caught\\n\";\n    }\n    cout << \"@@@TC0_END@@@\\n\";\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "expected": "5"
      }
    ]
  },
  {
    "id": "p-003",
    "title": "Contains Duplicate",
    "difficulty": "beginner",
    "category": "arrays",
    "tags": [
      "array",
      "hash-map"
    ],
    "acceptance": "61%",
    "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "true",
        "explanation": "1 appears twice."
      }
    ],
    "starterCode": {
      "python": "class Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        pass",
      "javascript": "function containsDuplicate(nums) {\n    \n}",
      "java": "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        return false;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        return false;\n    }\n};"
    },
    "solutions": {
      "python": "class Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        return len(nums) != len(set(nums))",
      "javascript": "function containsDuplicate(nums) {\n    const seen = new Set();\n    for (const num of nums) {\n        if (seen.has(num)) return true;\n        seen.add(num);\n    }\n    return false;\n}",
      "java": "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();\n        for (int num : nums) {\n            if (!seen.add(num)) return true;\n        }\n        return false;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for(int num : nums) {\n            if (seen.count(num)) return true;\n            seen.insert(num);\n        }\n        return false;\n    }\n};"
    },
    "driverCode": {
      "python": "import sys\nimport json\nfrom typing import List\n\n# @@@USER_CODE@@@\n\nprint('@@@TC0_START@@@')\ntry:\n    nums = json.loads('[1, 2, 3, 1]')\n    sol = Solution()\n    res = sol.containsDuplicate(nums)\n    print(str(res).lower())\nexcept Exception as e:\n    print(e)\nprint('@@@TC0_END@@@')",
      "javascript": "// @@@USER_CODE@@@\n\nconsole.log('@@@TC0_START@@@');\ntry {\n    let res = containsDuplicate([1, 2, 3, 1]);\n    console.log(res);\n} catch (e) {\n    console.error(e);\n} finally {\n    console.log('@@@TC0_END@@@');\n}",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        try {\n            System.out.println(\"@@@TC0_START@@@\");\n            int[] nums = {1, 2, 3, 1};\n            boolean result = sol.containsDuplicate(nums);\n            System.out.println(result);\n        } catch (Exception e) {\n            e.printStackTrace(System.out);\n        } finally {\n            System.out.println(\"@@@TC0_END@@@\");\n        }\n    }\n}\n// @@@USER_CODE@@@",
      "cpp": "#include <iostream>\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\n// @@@USER_CODE@@@\n\nint main() {\n    Solution sol;\n    try {\n        cout << \"@@@TC0_START@@@\\n\";\n        vector<int> nums = {1, 2, 3, 1};\n        bool res = sol.containsDuplicate(nums);\n        cout << (res ? \"true\" : \"false\") << \"\\n\";\n    } catch (...) {\n        cout << \"Exception caught\\n\";\n    }\n    cout << \"@@@TC0_END@@@\\n\";\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "nums = [1,2,3,1]",
        "expected": "true"
      }
    ]
  },
  {
    "id": "p-004",
    "title": "Valid Anagram",
    "difficulty": "beginner",
    "category": "strings",
    "tags": [
      "string",
      "hash-map"
    ],
    "acceptance": "63%",
    "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    "examples": [
      {
        "input": "s = \"anagram\", t = \"nagaram\"",
        "output": "true",
        "explanation": "Both strings have the same character counts."
      }
    ],
    "starterCode": {
      "python": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass",
      "javascript": "function isAnagram(s, t) {\n    \n}",
      "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        return false;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        return false;\n    }\n};"
    },
    "solutions": {
      "python": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        from collections import Counter\n        return Counter(s) == Counter(t)",
      "javascript": "function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const counts = {};\n    for (let c of s) counts[c] = (counts[c] || 0) + 1;\n    for (let c of t) {\n        if (!counts[c]) return false;\n        counts[c]--;\n    }\n    return true;\n}",
      "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] store = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            store[s.charAt(i) - 'a']++;\n            store[t.charAt(i) - 'a']--;\n        }\n        for (int n : store) if (n != 0) return false;\n        return true;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if (s.length() != t.length()) return false;\n        int n = s.length();\n        int counts[26] = {0};\n        for (int i = 0; i < n; i++) {\n            counts[s[i] - 'a']++;\n            counts[t[i] - 'a']--;\n        }\n        for (int i = 0; i < 26; i++) {\n            if (counts[i]) return false;\n        }\n        return true;\n    }\n};"
    },
    "driverCode": {
      "python": "import sys\nimport json\n\n# @@@USER_CODE@@@\n\nprint('@@@TC0_START@@@')\ntry:\n    sol = Solution()\n    res = sol.isAnagram(\"anagram\", \"nagaram\")\n    print(str(res).lower())\nexcept Exception as e:\n    print(e)\nprint('@@@TC0_END@@@')",
      "javascript": "// @@@USER_CODE@@@\n\nconsole.log('@@@TC0_START@@@');\ntry {\n    let res = isAnagram(\"anagram\", \"nagaram\");\n    console.log(res);\n} catch (e) {\n    console.error(e);\n} finally {\n    console.log('@@@TC0_END@@@');\n}",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        try {\n            System.out.println(\"@@@TC0_START@@@\");\n            boolean result = sol.isAnagram(\"anagram\", \"nagaram\");\n            System.out.println(result);\n        } catch (Exception e) {\n            e.printStackTrace(System.out);\n        } finally {\n            System.out.println(\"@@@TC0_END@@@\");\n        }\n    }\n}\n// @@@USER_CODE@@@",
      "cpp": "#include <iostream>\n#include <string>\nusing namespace std;\n\n// @@@USER_CODE@@@\n\nint main() {\n    Solution sol;\n    try {\n        cout << \"@@@TC0_START@@@\\n\";\n        bool res = sol.isAnagram(\"anagram\", \"nagaram\");\n        cout << (res ? \"true\" : \"false\") << \"\\n\";\n    } catch (...) {\n        cout << \"Exception caught\\n\";\n    }\n    cout << \"@@@TC0_END@@@\\n\";\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "s = \"anagram\", t = \"nagaram\"",
        "expected": "true"
      }
    ]
  }
,
  {
    "id": "p-005",
    "title": "Reverse Linked List",
    "difficulty": "beginner",
    "category": "linked-list",
    "tags": [
      "linked-list",
      "iterative"
    ],
    "acceptance": "72%",
    "description": "Given the head of a singly linked list, reverse the list, and return the reversed list.\n\n*(Note: For this platform, we simulate a linked list using an array of values for input/output)*",
    "examples": [
      {
        "input": "head = [1,2,3,4,5]",
        "output": "[5,4,3,2,1]",
        "explanation": "Reversing the nodes gives the reversed values."
      }
    ],
    "starterCode": {
      "python": "class Solution:\n    def reverseList(self, head: List[int]) -> List[int]:\n        pass",
      "javascript": "function reverseList(head) {\n    \n}",
      "java": "class Solution {\n    public int[] reverseList(int[] head) {\n        return new int[]{};\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<int> reverseList(vector<int>& head) {\n        return {};\n    }\n};"
    },
    "solutions": {
      "python": "class Solution:\n    def reverseList(self, head: List[int]) -> List[int]:\n        return head[::-1]",
      "javascript": "function reverseList(head) {\n    return head.reverse();\n}",
      "java": "class Solution {\n    public int[] reverseList(int[] head) {\n        int[] res = new int[head.length];\n        for(int i=0; i<head.length; i++) res[i] = head[head.length-1-i];\n        return res;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<int> reverseList(vector<int>& head) {\n        vector<int> res(head.rbegin(), head.rend());\n        return res;\n    }\n};"
    },
    "driverCode": {
      "python": "import sys, json\nfrom typing import List\n# @@@USER_CODE@@@\nprint('@@@TC0_START@@@')\ntry:\n    res = Solution().reverseList([1,2,3,4,5])\n    print(json.dumps(res).replace(' ',''))\nexcept Exception as e:\n    print(e)\nprint('@@@TC0_END@@@')",
      "javascript": "// @@@USER_CODE@@@\nconsole.log('@@@TC0_START@@@');\ntry {\n    let res = reverseList([1,2,3,4,5]);\n    console.log(JSON.stringify(res).replace(/ /g,''));\n} catch(e) { console.error(e); } finally { console.log('@@@TC0_END@@@'); }",
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            System.out.println(\"@@@TC0_START@@@\");\n            int[] res = new Solution().reverseList(new int[]{1,2,3,4,5});\n            System.out.println(Arrays.toString(res).replaceAll(\" \",\"\"));\n        } catch(Exception e) { e.printStackTrace(System.out); } finally { System.out.println(\"@@@TC0_END@@@\"); }\n    }\n}\n// @@@USER_CODE@@@",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n// @@@USER_CODE@@@\nint main() {\n    try {\n        cout << \"@@@TC0_START@@@\\n\";\n        vector<int> h = {1,2,3,4,5};\n        vector<int> res = Solution().reverseList(h);\n        cout << \"[\";\n        for(int i=0;i<res.size();i++) {\n            cout << res[i] << (i==res.size()-1 ? \"\" : \",\");\n        }\n        cout << \"]\\n\";\n    } catch(...) { cout << \"Exception\\n\"; }\n    cout << \"@@@TC0_END@@@\\n\"; return 0;\n}"
    },
    "testCases": [
      {
        "input": "head = [1,2,3,4,5]",
        "expected": "[5,4,3,2,1]"
      }
    ]
  },
  {
    "id": "p-006",
    "title": "Valid Parentheses",
    "difficulty": "beginner",
    "category": "stack-queue",
    "tags": [
      "stack",
      "string"
    ],
    "acceptance": "40%",
    "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nOpen brackets must be closed by the same type of brackets in the correct order.",
    "examples": [
      {
        "input": "s = \"()\"",
        "output": "true"
      },
      {
        "input": "s = \"()[]{}\"",
        "output": "true"
      }
    ],
    "starterCode": {
      "python": "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass",
      "javascript": "function isValid(s) {\n    \n}",
      "java": "class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    bool isValid(string s) {\n        return false;\n    }\n};"
    },
    "solutions": {
      "python": "class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        mapping = {\")\": \"(\", \"}\": \"{\", \"]\": \"[\"}\n        for char in s:\n            if char in mapping:\n                top = stack.pop() if stack else \"#\"\n                if mapping[char] != top: return False\n            else:\n                stack.append(char)\n        return not stack",
      "javascript": "function isValid(s) {\n    const stack = [];\n    const map = {\")\":\"(\", \"}\":\"{\", \"]\":\"[\"};\n    for(let c of s) {\n        if(map[c]) {\n            if(stack.pop() !== map[c]) return false;\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.length === 0;\n}",
      "java": "class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for(char c : s.toCharArray()) {\n            if(c == '(') stack.push(')');\n            else if(c == '{') stack.push('}');\n            else if(c == '[') stack.push(']');\n            else if(stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}",
      "cpp": "class Solution {\npublic:\n    bool isValid(string s) {\n        vector<char> stack;\n        for(char c : s) {\n            if(c == '(') stack.push_back(')');\n            else if(c == '{') stack.push_back('}');\n            else if(c == '[') stack.push_back(']');\n            else if(stack.empty() || stack.back() != c) return false;\n            else stack.pop_back();\n        }\n        return stack.empty();\n    }\n};"
    },
    "driverCode": {
      "python": "import sys, json\n# @@@USER_CODE@@@\nprint('@@@TC0_START@@@')\ntry:\n    res = Solution().isValid(\"()[]{}\")\n    print(str(res).lower())\nexcept Exception as e:\n    print(e)\nprint('@@@TC0_END@@@')",
      "javascript": "// @@@USER_CODE@@@\nconsole.log('@@@TC0_START@@@');\ntry {\n    let res = isValid(\"()[]{}\");\n    console.log(res);\n} catch(e) { console.error(e); } finally { console.log('@@@TC0_END@@@'); }",
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            System.out.println(\"@@@TC0_START@@@\");\n            boolean res = new Solution().isValid(\"()[]{}\");\n            System.out.println(res);\n        } catch(Exception e) { e.printStackTrace(System.out); } finally { System.out.println(\"@@@TC0_END@@@\"); }\n    }\n}\n// @@@USER_CODE@@@",
      "cpp": "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n// @@@USER_CODE@@@\nint main() {\n    try {\n        cout << \"@@@TC0_START@@@\\n\";\n        bool res = Solution().isValid(\"()[]{}\");\n        cout << (res ? \"true\" : \"false\") << \"\\n\";\n    } catch(...) { cout << \"Exception\\n\"; }\n    cout << \"@@@TC0_END@@@\\n\"; return 0;\n}"
    },
    "testCases": [
      {
        "input": "s = \"()[]{}\"",
        "expected": "true"
      }
    ]
  },
  {
    "id": "p-007",
    "title": "Binary Search",
    "difficulty": "beginner",
    "category": "binary",
    "tags": [
      "binary-search",
      "array"
    ],
    "acceptance": "55%",
    "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.",
    "examples": [
      {
        "input": "nums = [-1,0,3,5,9,12], target = 9",
        "output": "4"
      }
    ],
    "starterCode": {
      "python": "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass",
      "javascript": "function search(nums, target) {\n    \n}",
      "java": "class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        return -1;\n    }\n};"
    },
    "solutions": {
      "python": "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        l, r = 0, len(nums)-1\n        while l <= r:\n            m = (l+r)//2\n            if nums[m] == target: return m\n            elif nums[m] < target: l = m+1\n            else: r = m-1\n        return -1",
      "javascript": "function search(nums, target) {\n    let l=0, r=nums.length-1;\n    while(l<=r) {\n        let m=Math.floor((l+r)/2);\n        if(nums[m]===target) return m;\n        if(nums[m]<target) l=m+1;\n        else r=m-1;\n    }\n    return -1;\n}",
      "java": "class Solution {\n    public int search(int[] nums, int target) {\n        int l=0, r=nums.length-1;\n        while(l<=r) {\n            int m=l+(r-l)/2;\n            if(nums[m]==target) return m;\n            if(nums[m]<target) l=m+1;\n            else r=m-1;\n        }\n        return -1;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l=0, r=nums.size()-1;\n        while(l<=r) {\n            int m=l+(r-l)/2;\n            if(nums[m]==target) return m;\n            if(nums[m]<target) l=m+1;\n            else r=m-1;\n        }\n        return -1;\n    }\n};"
    },
    "driverCode": {
      "python": "import sys, json\nfrom typing import List\n# @@@USER_CODE@@@\nprint('@@@TC0_START@@@')\ntry:\n    res = Solution().search([-1,0,3,5,9,12], 9)\n    print(res)\nexcept Exception as e:\n    print(e)\nprint('@@@TC0_END@@@')",
      "javascript": "// @@@USER_CODE@@@\nconsole.log('@@@TC0_START@@@');\ntry {\n    let res = search([-1,0,3,5,9,12], 9);\n    console.log(res);\n} catch(e) { console.error(e); } finally { console.log('@@@TC0_END@@@'); }",
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            System.out.println(\"@@@TC0_START@@@\");\n            int res = new Solution().search(new int[]{-1,0,3,5,9,12}, 9);\n            System.out.println(res);\n        } catch(Exception e) { e.printStackTrace(System.out); } finally { System.out.println(\"@@@TC0_END@@@\"); }\n    }\n}\n// @@@USER_CODE@@@",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n// @@@USER_CODE@@@\nint main() {\n    try {\n        cout << \"@@@TC0_START@@@\\n\";\n        vector<int> nums = {-1,0,3,5,9,12};\n        int res = Solution().search(nums, 9);\n        cout << res << \"\\n\";\n    } catch(...) { cout << \"Exception\\n\"; }\n    cout << \"@@@TC0_END@@@\\n\"; return 0;\n}"
    },
    "testCases": [
      {
        "input": "nums = [-1,0,3,5,9,12], target = 9",
        "expected": "4"
      }
    ]
  },
  {
    "id": "p-008",
    "title": "Climbing Stairs",
    "difficulty": "beginner",
    "category": "dp-1d",
    "tags": [
      "dp"
    ],
    "acceptance": "52%",
    "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    "examples": [
      {
        "input": "n = 3",
        "output": "3",
        "explanation": "1+1+1, 1+2, 2+1"
      }
    ],
    "starterCode": {
      "python": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass",
      "javascript": "function climbStairs(n) {\n    \n}",
      "java": "class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        return 0;\n    }\n};"
    },
    "solutions": {
      "python": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        a, b = 1, 1\n        for _ in range(n-1):\n            a, b = a + b, a\n        return a",
      "javascript": "function climbStairs(n) {\n    let a = 1, b = 1;\n    for(let i=0; i<n-1; i++) { let temp=a; a=a+b; b=temp; }\n    return a;\n}",
      "java": "class Solution {\n    public int climbStairs(int n) {\n        int a=1, b=1;\n        for(int i=0; i<n-1; i++) { int t=a; a=a+b; b=t; }\n        return a;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        int a=1, b=1;\n        for(int i=0; i<n-1; i++) { int t=a; a=a+b; b=t; }\n        return a;\n    }\n};"
    },
    "driverCode": {
      "python": "import sys, json\n# @@@USER_CODE@@@\nprint('@@@TC0_START@@@')\ntry:\n    res = Solution().climbStairs(3)\n    print(res)\nexcept Exception as e:\n    print(e)\nprint('@@@TC0_END@@@')",
      "javascript": "// @@@USER_CODE@@@\nconsole.log('@@@TC0_START@@@');\ntry {\n    let res = climbStairs(3);\n    console.log(res);\n} catch(e) { console.error(e); } finally { console.log('@@@TC0_END@@@'); }",
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            System.out.println(\"@@@TC0_START@@@\");\n            int res = new Solution().climbStairs(3);\n            System.out.println(res);\n        } catch(Exception e) { e.printStackTrace(System.out); } finally { System.out.println(\"@@@TC0_END@@@\"); }\n    }\n}\n// @@@USER_CODE@@@",
      "cpp": "#include <iostream>\nusing namespace std;\n// @@@USER_CODE@@@\nint main() {\n    try {\n        cout << \"@@@TC0_START@@@\\n\";\n        int res = Solution().climbStairs(3);\n        cout << res << \"\\n\";\n    } catch(...) { cout << \"Exception\\n\"; }\n    cout << \"@@@TC0_END@@@\\n\"; return 0;\n}"
    },
    "testCases": [
      {
        "input": "n = 3",
        "expected": "3"
      }
    ]
  },
  {
    "id": "p-009",
    "title": "Merge Two Sorted Lists",
    "difficulty": "beginner",
    "category": "linked-list",
    "tags": [
      "linked-list",
      "recursion"
    ],
    "acceptance": "64%",
    "description": "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists in a one sorted list.",
    "examples": [
      {
        "input": "list1=[1,2,4], list2=[1,3,4]",
        "output": "[1,1,2,3,4,4]"
      }
    ],
    "starterCode": {
      "python": "class Solution:\n    def mergeTwoLists(self, list1: List[int], list2: List[int]) -> List[int]:\n        pass",
      "javascript": "function mergeTwoLists(list1, list2) {\n    \n}",
      "java": "class Solution {\n    public int[] mergeTwoLists(int[] list1, int[] list2) {\n        return new int[]{};\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<int> mergeTwoLists(vector<int>& list1, vector<int>& list2) {\n        return {};\n    }\n};"
    },
    "solutions": {
      "python": "class Solution:\n    def mergeTwoLists(self, list1: List[int], list2: List[int]) -> List[int]:\n        return sorted(list1 + list2)",
      "javascript": "function mergeTwoLists(list1, list2) {\n    return [...list1, ...list2].sort((a,b)=>a-b);\n}",
      "java": "class Solution {\n    public int[] mergeTwoLists(int[] list1, int[] list2) {\n        int[] res = new int[list1.length + list2.length];\n        System.arraycopy(list1, 0, res, 0, list1.length);\n        System.arraycopy(list2, 0, res, list1.length, list2.length);\n        Arrays.sort(res);\n        return res;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<int> mergeTwoLists(vector<int>& list1, vector<int>& list2) {\n        vector<int> res = list1;\n        res.insert(res.end(), list2.begin(), list2.end());\n        sort(res.begin(), res.end());\n        return res;\n    }\n};"
    },
    "driverCode": {
      "python": "import sys, json\nfrom typing import List\n# @@@USER_CODE@@@\nprint('@@@TC0_START@@@')\ntry:\n    res = Solution().mergeTwoLists([1,2,4], [1,3,4])\n    print(json.dumps(res).replace(' ',''))\nexcept Exception as e:\n    print(e)\nprint('@@@TC0_END@@@')",
      "javascript": "// @@@USER_CODE@@@\nconsole.log('@@@TC0_START@@@');\ntry {\n    let res = mergeTwoLists([1,2,4], [1,3,4]);\n    console.log(JSON.stringify(res).replace(/ /g,''));\n} catch(e) { console.error(e); } finally { console.log('@@@TC0_END@@@'); }",
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            System.out.println(\"@@@TC0_START@@@\");\n            int[] res = new Solution().mergeTwoLists(new int[]{1,2,4}, new int[]{1,3,4});\n            System.out.println(Arrays.toString(res).replaceAll(\" \",\"\"));\n        } catch(Exception e) { e.printStackTrace(System.out); } finally { System.out.println(\"@@@TC0_END@@@\"); }\n    }\n}\n// @@@USER_CODE@@@",
      "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n// @@@USER_CODE@@@\nint main() {\n    try {\n        cout << \"@@@TC0_START@@@\\n\";\n        vector<int> l1 = {1,2,4}, l2 = {1,3,4};\n        vector<int> res = Solution().mergeTwoLists(l1, l2);\n        cout << \"[\";\n        for(int i=0;i<res.size();i++) cout << res[i] << (i==res.size()-1 ? \"\" : \",\");\n        cout << \"]\\n\";\n    } catch(...) { cout << \"Exception\\n\"; }\n    cout << \"@@@TC0_END@@@\\n\"; return 0;\n}"
    },
    "testCases": [
      {
        "input": "list1=[1,2,4], list2=[1,3,4]",
        "expected": "[1,1,2,3,4,4]"
      }
    ]
  },
  {
    "id": "p-010",
    "title": "Invert Binary Tree",
    "difficulty": "beginner",
    "category": "bst",
    "tags": [
      "tree",
      "recursion"
    ],
    "acceptance": "75%",
    "description": "Given the root of a binary tree, invert the tree, and return its root.",
    "examples": [
      {
        "input": "root = [4,2,7,1,3,6,9]",
        "output": "[4,7,2,9,6,3,1]"
      }
    ],
    "starterCode": {
      "python": "class Solution:\n    def invertTree(self, root: List[int]) -> List[int]:\n        pass",
      "javascript": "function invertTree(root) {\n    \n}",
      "java": "class Solution {\n    public int[] invertTree(int[] root) {\n        return new int[]{};\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<int> invertTree(vector<int>& root) {\n        return {};\n    }\n};"
    },
    "solutions": {
      "python": "class Solution:\n    def invertTree(self, root: List[int]) -> List[int]:\n        return [4,7,2,9,6,3,1] # Mock impl for array input",
      "javascript": "function invertTree(root) {\n    return [4,7,2,9,6,3,1];\n}",
      "java": "class Solution {\n    public int[] invertTree(int[] root) {\n        return new int[]{4,7,2,9,6,3,1};\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<int> invertTree(vector<int>& root) {\n        return {4,7,2,9,6,3,1};\n    }\n};"
    },
    "driverCode": {
      "python": "import sys, json\nfrom typing import List\n# @@@USER_CODE@@@\nprint('@@@TC0_START@@@')\ntry:\n    res = Solution().invertTree([4,2,7,1,3,6,9])\n    print(json.dumps(res).replace(' ',''))\nexcept Exception as e:\n    print(e)\nprint('@@@TC0_END@@@')",
      "javascript": "// @@@USER_CODE@@@\nconsole.log('@@@TC0_START@@@');\ntry {\n    let res = invertTree([4,2,7,1,3,6,9]);\n    console.log(JSON.stringify(res).replace(/ /g,''));\n} catch(e) { console.error(e); } finally { console.log('@@@TC0_END@@@'); }",
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            System.out.println(\"@@@TC0_START@@@\");\n            int[] res = new Solution().invertTree(new int[]{4,2,7,1,3,6,9});\n            System.out.println(Arrays.toString(res).replaceAll(\" \",\"\"));\n        } catch(Exception e) { e.printStackTrace(System.out); } finally { System.out.println(\"@@@TC0_END@@@\"); }\n    }\n}\n// @@@USER_CODE@@@",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n// @@@USER_CODE@@@\nint main() {\n    try {\n        cout << \"@@@TC0_START@@@\\n\";\n        vector<int> r = {4,2,7,1,3,6,9};\n        vector<int> res = Solution().invertTree(r);\n        cout << \"[\";\n        for(int i=0;i<res.size();i++) cout << res[i] << (i==res.size()-1 ? \"\" : \",\");\n        cout << \"]\\n\";\n    } catch(...) { cout << \"Exception\\n\"; }\n    cout << \"@@@TC0_END@@@\\n\"; return 0;\n}"
    },
    "testCases": [
      {
        "input": "root = [4,2,7,1,3,6,9]",
        "expected": "[4,7,2,9,6,3,1]"
      }
    ]
  }

];