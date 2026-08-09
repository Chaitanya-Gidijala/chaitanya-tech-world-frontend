export const tokenUsageCostContent = `
# Token Usage & Cost Calculation

Unlike traditional software APIs where you pay a flat monthly fee for unlimited requests, Generative AI APIs operate on a **consumption-based model** (pay-as-you-go).

If you don't understand how billing works, you can easily rack up a $5,000 bill overnight if a bug causes your code to loop infinitely! 

Let's look at exactly how providers charge you for using their AI.

---

## The Currency of AI: Tokens

As we learned in Phase 1, AI models do not read words; they read Tokens (chunks of characters). Because tokens are what the GPU actually processes, **you are billed per token**.

When you make an API request, you are billed for two separate things:
1. **Input Tokens (Prompt Tokens):** Every token you send *to* the API in your request. (This includes your system prompt, the user's question, and any context/history you send).
2. **Output Tokens (Completion Tokens):** Every token the AI generates and sends *back* to you.

### Input vs Output Pricing

Generating text is mathematically much harder and more computationally expensive for the GPU than reading text. Therefore, **Output Tokens are almost always much more expensive than Input Tokens.**

**Example Pricing (gpt-4o):**
* Input: $5.00 per 1 million tokens
* Output: $15.00 per 1 million tokens

If you send a massive 500-page PDF to the model (high input tokens) and ask for a 2-sentence summary (low output tokens), it might actually be cheaper than sending a 1-sentence prompt and asking the AI to write a 5-page essay!

## Tracking Usage in the API Response

How do you know how many tokens you just used? You don't have to guess.

Every single time the API sends a response back to your code, it includes a \`usage\` object at the very bottom of the JSON payload.

**Example API Response:**
\`\`\`json
{
  "id": "chatcmpl-123",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      }
    }
  ],
  "usage": {
    "prompt_tokens": 14,
    "completion_tokens": 7,
    "total_tokens": 21
  }
}
\`\`\`

If you are building a commercial application, you must capture these \`usage\` numbers in your database and associate them with the user who made the request. Otherwise, you won't know which of your users is costing you the most money!

> [!CAUTION]
> **The Infinite Loop Danger**
> If you write an automated script that queries an LLM, parses the response, and automatically queries the LLM again based on that response... BE CAREFUL. If the AI hallucinates unexpected formatting, your code might get stuck in an infinite loop, generating thousands of tokens per second until your credit card is maxed out. Always put a strict counter limit (e.g., max 5 loops) in your code!
`;
