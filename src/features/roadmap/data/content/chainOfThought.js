export const chainOfThoughtContent = `
# Chain of Thought Prompting (CoT)

Large Language Models are terrible at math. They are also terrible at complex logic puzzles. 

Why? Because they don't actually "think." They just predict the next word. If you ask an AI a complex math question, and it tries to immediately predict the final answer, it will often guess wrong.

**Chain of Thought (CoT)** is how we fix this. 

---

## 1. What is Chain of Thought?

Chain of Thought simply means forcing the AI to show its work step-by-step *before* it gives you the final answer.

If you ask a human to multiply 14 x 27 in their head instantly, they might fail. But if you give them a piece of paper and tell them to write down the steps, they will easily get it right. AI works the exact same way!

Because the AI predicts the *next* token based on the *previous* tokens, if the AI generates the steps to solve a problem first, those steps become part of the context window! The AI then uses its own generated steps to accurately predict the final answer.

## 2. How to use it

You can trigger Chain of Thought in two ways:

**Method 1: The Magic Phrase (Zero-Shot CoT)**
Simply add this exact phrase to the end of any complex prompt:
> *"Let's think step by step."*

It sounds silly, but researchers discovered that appending this phrase drastically increases an AI's accuracy on logic puzzles. It forces the AI to output a bulleted list of reasoning before outputting the conclusion.

**Method 2: Few-Shot CoT**
You provide an example of how to solve the problem step-by-step.
> Q: Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many does he have now?
> 
> A: Roger started with 5 balls. 2 cans of 3 balls each is 6 balls. 5 + 6 = 11. The answer is 11.
> 
> Q: The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have?
> 
> A: 

By showing the AI that you want it to write out the math ("The cafeteria started with 23..."), you guarantee it will reason correctly.

> [!NOTE]
> Modern models like OpenAI's "o1" or "o3" models do Chain of Thought automatically in the background before they show you the answer!
`;
