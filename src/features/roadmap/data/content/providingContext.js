export const providingContextContent = `
# Providing Context & Grounding (RAG)

If you ask an AI, *"What is our company's refund policy?"* it will hallucinate an answer. It doesn't know your company's policy because it wasn't in its training data.

To get accurate answers about your specific data, you have to **Ground** the AI by providing context.

---

## 1. The Basics of Grounding

Grounding simply means pasting the factual information into the prompt, and telling the AI to *only* use that information to answer the question.

**Example Prompt:**
> "Use the following company policy text to answer the user's question. If the answer is not contained in the text, say 'I don't know.' Do not make up an answer.
>
> <policy>
> Refunds are only accepted within 30 days of purchase with a valid receipt. Digital goods are non-refundable.
> </policy>
>
> User Question: Can I refund a video game I bought yesterday?"

By doing this, you have solved hallucination. The AI will correctly answer that digital goods are non-refundable, because the answer was in its context window!

## 2. What is RAG?

You might hear the buzzword **RAG (Retrieval-Augmented Generation)**. It sounds complicated, but it is exactly what we just did above, just automated by software.

If your company has 10,000 PDF documents, you can't paste all of them into the prompt (they won't fit in the Context Window).

Instead, RAG works like this:
1. The user asks a question.
2. Your software searches the 10,000 PDFs for the 3 most relevant pages.
3. Your software pastes those 3 pages into the prompt as "Context" (just like we did above).
4. The AI reads those 3 pages and answers the user.

That is RAG! It is simply the act of retrieving information and shoving it into the prompt so the AI is grounded in reality.
`;
