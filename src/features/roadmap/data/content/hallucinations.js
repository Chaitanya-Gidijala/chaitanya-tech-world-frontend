export const content = `
# Hallucinations & AI Limitations: When the AI Lies

If there is one thing you must understand before putting any AI into production, it's this: **AI models do not know what a "fact" is.** 

When an AI confidently tells you something that is completely untrue, we call this a **Hallucination**. 

---

## What is a Hallucination?

A hallucination occurs when an AI generates false, fabricated, or nonsensical information, but presents it with absolute confidence as if it were a proven fact.

For example, if you ask an AI: *"Who was the first person to walk on Mars?"*

A hallucinating AI might respond: *"The first person to walk on Mars was astronaut David Sterling during the Ares 1 mission in 2032."* (This never happened, obviously).

### Why do they happen?

To understand why hallucinations happen, remember how we defined these models in the previous lessons: **They are next-token prediction engines.** 

1. **They don't have a database of truth:** An LLM is not doing a Google search (unless specifically given a web-search tool). It doesn't have a SQL database of facts in its brain. 
2. **They play the probability game:** The AI is simply looking at the words in your prompt, doing complex math, and guessing the most statistically likely next word based on its training data.
3. **Plausible vs True:** If the AI doesn't know an answer, it doesn't naturally say "I don't know." Instead, the math forces it to guess what a *plausible-sounding* answer would look like. To the AI, the sentence *"David Sterling walked on Mars"* sounds grammatically correct and statistically plausible based on sci-fi books in its training data, so it outputs it.

---

## The Types of Hallucinations

1. **Factual Hallucinations:** Inventing historical events, fake people, or fake statistics.
2. **Coding Hallucinations (Very Dangerous):** Inventing programming libraries or API endpoints that don't actually exist. A developer might copy the code, and it will crash because the library is a fabrication.
3. **Logic Hallucinations:** Failing at basic math or logical deduction, despite generating text that sounds like a mathematical proof.

## How to Prevent Hallucinations

You can never 100% eliminate hallucinations from a raw LLM, but you can drastically reduce them using these techniques:

* **Lower the Temperature:** We learned earlier that lowering the Temperature setting forces the AI to pick the most probable words. A temperature of 0 reduces creative hallucinations.
* **Prompt Engineering (Grounding):** Tell the AI explicitly in the prompt: *"If you do not know the answer based on the provided text, say 'I do not know'. Do not guess."*
* **RAG (Retrieval-Augmented Generation):** Instead of relying on the AI's memory, you search your own secure database for the correct facts, give those facts to the AI in the prompt, and tell it to summarize *only* what you gave it. We will cover this extensively in Phase 6.

> [!WARNING]
> **The Golden Rule for Developers:**
> Never trust an LLM's output blindly in a production environment, especially for critical fields like healthcare, finance, or law. Always implement human-in-the-loop oversight or programmatic verification for sensitive data.
`;
