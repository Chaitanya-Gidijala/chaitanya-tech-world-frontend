export const tokensAndContextContent = `
# Tokens & Context Windows

We've been saying that AI predicts the next "word." But that's a slight lie to keep things simple. AI doesn't actually read words; it reads **Tokens**.

Understanding tokens is the secret to understanding why AI sometimes cuts off in the middle of a sentence, or why it suddenly forgets instructions you gave it earlier in the conversation.

---

<img src="/assets/gen_ai_tokens.jpg" alt="Diagram showing Tokens and Context Windows" className="tutorial-diagram" />
<p className="tutorial-caption">Words are broken down into smaller chunks called tokens. The Context Window is the strict limit on how many tokens the AI can hold in its memory at one time.</p>

---

## 1. What is a Token?

To an AI, the English language is just a series of numbers. Before your prompt goes into the neural network, it is chopped up into pieces called tokens. 

*   A short, common word like \`apple\` might be **1 token**.
*   A longer, complex word like \`Hamburger\` might be split into **3 tokens**: \`Ham\` + \`bur\` + \`ger\`.
*   A general rule of thumb: **100 tokens is roughly 75 words.**

Why does it do this? Because breaking language into smaller, reusable lego blocks makes it much easier for the AI's math engine to process relationships between prefixes, suffixes, and root words!

## 2. The Context Window (The AI's Short-Term Memory)

Every AI model has a hard limit on how many tokens it can process at once. This limit is called the **Context Window**.

Imagine the context window as a conveyor belt that can only hold 10,000 items.
1. When you type a prompt, you put tokens onto the belt. 
2. When the AI generates a response, it adds those new tokens onto the belt too.
3. In a long conversation, as you keep chatting, the belt fills up.
4. Once you hit the 10,000 token limit, the oldest tokens (the start of your conversation) fall off the back of the conveyor belt and disappear forever.

**If the AI forgets a rule you gave it an hour ago, it's not being stupid. The rule literally fell out of its Context Window.**

## 3. Best Practices for Tokens

As a Prompt Engineer, you must manage the Context Window wisely:

1.  **Don't overstuff:** If you paste a 50-page PDF into an AI with a small context window, it will instantly forget the beginning of the PDF.
2.  **Put important instructions at the END:** Because of how the math works, AI models pay slightly more attention to the tokens at the very end of your prompt (right before it starts predicting the next token). Always put your most critical rule (e.g., *"Make sure to output in JSON format"*) at the very bottom of your prompt!
`;
