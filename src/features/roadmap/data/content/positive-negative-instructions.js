export const content = `
# Positive & Negative Instructions

When writing prompts, beginners usually only tell the AI what they *want* it to do. This is called a **Positive Instruction**.

However, professional prompt engineers know that telling the AI what *NOT* to do is often just as important. These are called **Negative Instructions**.

---

## Why Do We Need Negative Instructions?

Because LLMs are trained on the entire internet, their natural tendency is to be highly conversational, overly polite, and wordy. They love to add fluff.

If you ask an AI: *"Extract the company name from this text: 'I work at Google.'"*

The AI might respond: *"Sure! I'd be happy to help you with that. The company name extracted from your text is: Google. Let me know if you need anything else!"*

If you are building an automated app that expects to receive just the word "Google" so it can save it to a database, the AI's polite rambling will completely crash your application!

## How to Use Negative Instructions

To fix this, we combine positive instructions with strict negative instructions.

### Example: The Data Extraction Task

**Bad Prompt (Only Positive):**
> Extract the user's age from this text: "Hi, I am John and I turned 34 yesterday."

**Good Prompt (Positive + Negative):**
> Extract the user's age from the text below. 
> 
> **RULES:**
> - Output ONLY the numerical age.
> - Do NOT include any conversational text.
> - Do NOT include the word "years".
> 
> Text: "Hi, I am John and I turned 34 yesterday."

**Result:** \`34\`

By explicitly forbidding conversational text and units, you force the AI into a strict, programmatic output format.

> [!TIP]
> **Pro Tip: Group your Negative Instructions**
> Don't scatter negative instructions randomly throughout a long prompt. Group them together in a bulleted list under a heading like \`### Constraints\` or \`### Do NOT:\`. This makes it easier for the AI's attention mechanism to process them as strict rules.

## Common Negative Instructions to Keep Handy

Here are some incredibly useful negative instructions you will use constantly when building AI apps:

* \`Do not include any pleasantries or conversational filler.\`
* \`Do not explain your reasoning.\`
* \`Do not output markdown formatting (like bold or italics).\`
* \`If the answer is not contained in the provided text, do not guess. Output exactly "Not Found".\`

Using negative constraints effectively is the fastest way to make your AI interactions feel less like a chatty bot and more like a precise software tool!
`;
