export const content = `
# Prompt Chaining: Dividing and Conquering

One of the biggest mistakes beginners make is trying to cram a massive, 10-step complex workflow into a single prompt. 

They write a prompt like: *"Read this 50-page document, summarize it, translate the summary to French, extract all the dates, format the dates as JSON, and write a polite email to my boss attaching the JSON."*

The AI will almost certainly fail at one or more of these steps. Why? Because LLMs have a limited attention span. When you overload them with instructions, they drop the ball.

The professional solution is **Prompt Chaining**.

---

## What is Prompt Chaining?

Prompt Chaining is the technique of breaking a large, complex task into a sequence of smaller, highly focused prompts. You take the output of Prompt #1 and pass it as the input to Prompt #2.

### An Example Workflow

Instead of the massive prompt above, a professional developer would build an application that executes three separate, chained AI calls:

**Step 1 (The Summarizer):**
* **Prompt 1:** *"Read this document and extract the key findings regarding quarterly revenue. Do not include anything else."*
* **Output 1:** (A concise text summary of revenue).

**Step 2 (The Data Extractor):**
* **Prompt 2:** *"Take the following summary and extract any dates and revenue figures. Output ONLY a valid JSON array. Summary: [Insert Output 1 here]"*
* **Output 2:** \`[{"date": "Q1", "revenue": "1M"}]\`

**Step 3 (The Writer):**
* **Prompt 3:** *"Write a polite email to my boss attaching the following financial data. Data: [Insert Output 2 here]"*
* **Final Output:** The perfectly crafted email.

---

## Why Chaining is Superior

1. **Higher Accuracy:** By giving the AI only ONE job at a time, it performs that job with near-perfect accuracy.
2. **Easier Debugging:** If the final email is wrong, you can look at the logs and see exactly which step failed. If it was one massive prompt, it's a black box.
3. **Cheaper & Faster:** Sometimes you can use a cheap, fast model (like GPT-4o-mini) for the simple extraction steps, and only use the expensive model (GPT-4o) for the complex writing step. 

> [!CAUTION]
> **The Trade-off: Latency**
> The only downside to Prompt Chaining is latency (speed). Because you are making 3 separate API calls sequentially (waiting for one to finish before starting the next), the total process will take longer than a single prompt. You must weigh the need for accuracy against the need for speed.

When we get to AI Agents and LangChain later in the roadmap, you'll see that chaining is the fundamental building block of all advanced AI architectures!
`;
