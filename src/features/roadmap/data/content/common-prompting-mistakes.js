export const content = `
# Common Prompting Mistakes

We have covered the fundamentals of prompt engineering: giving strict instructions, using negative constraints, formatting output, and chaining tasks.

To wrap up Phase 2, let's look at the three most common mistakes beginners make when writing prompts, and how you can avoid them!

---

## 1. The "Polite Conversationalist" Mistake

**The Mistake:** Treating the LLM like a human coworker.
* *"Hi ChatGPT! I hope you are having a wonderful day. Could you please do me a huge favor and write a short script for me? Thanks so much!"*

**Why it's bad:** LLMs are not conscious. They do not have feelings. By adding all this conversational fluff, you are actually distracting the AI's attention mechanism away from the core task. You are wasting tokens (which costs money), increasing latency, and increasing the chance of hallucinations.

**The Fix:** Be direct, strict, and programmatic.
* *"Write a python script to reverse a string. No pleasantries. No markdown."*

## 2. The "Too Much All At Once" Mistake

**The Mistake:** Cramming a 15-step workflow into a single, massive prompt.
* *"Read this PDF, summarize it, translate it to Spanish, extract the dates, format them as JSON, write an email, and give me 5 marketing ideas based on the summary."*

**Why it's bad:** LLMs suffer from "Lost in the Middle" syndrome. If you give them 10 instructions, they will usually accomplish the first 2 and the last 2 perfectly, but completely forget instructions 3 through 8. 

**The Fix:** Use **Prompt Chaining**. Break the massive task into 3 or 4 smaller API calls. Have one prompt do the summary. Pass the summary to the next prompt to do the translation.

## 3. The "Vague Vibe" Mistake

**The Mistake:** Giving subjective instructions and expecting the AI to read your mind.
* *"Make the email sound professional but fun, and not too long."*

**Why it's bad:** What does "fun" mean? What does "not too long" mean? The AI will guess, and its guess will probably be different than yours.

**The Fix:** Be incredibly specific. Use hard numbers and exact adjectives.
* *"Tone: Professional but enthusiastic. Length: Exactly 3 paragraphs. Maximum 150 words total."*

> [!IMPORTANT]
> **The Ultimate Test**
> If you hand your prompt to a human intern and they have to ask you a clarifying question to complete the task, your prompt is not specific enough for an AI!

Mastering these concepts separates the amateurs from the true AI Engineers. Now, let's move on to Phase 3, where we learn how to talk to these models programmatically using APIs!
`;
