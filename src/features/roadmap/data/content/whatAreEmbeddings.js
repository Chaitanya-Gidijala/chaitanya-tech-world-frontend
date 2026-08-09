export const whatAreEmbeddingsContent = `
# What are Embeddings?

Welcome to Phase 4! You now know how to prompt an AI and how to talk to it via an API. 

But what happens when you want the AI to answer questions based on your company's private, 10,000-page employee handbook? You can't fit 10,000 pages into a prompt (context windows aren't that big, and it would be insanely expensive).

To solve this, we need to give the AI long-term memory. And the foundation of AI memory is a magical concept called **Embeddings**.

---

## The Problem with Words

Computers are fundamentally terrible at understanding human language. A computer doesn't know what the word "Apple" means. It just sees the letters A-P-P-L-E. 

To a computer, the word "Apple" (a fruit) and the word "Microsoft" (a company) are completely unrelated strings of text.

But as humans, we know that "Apple" and "Microsoft" share a very deep, semantic relationship. They are both tech giants, they both make computers, and they are rivals. 

**How do we teach a computer to understand the *meaning* and *relationship* between concepts, rather than just the spelling of words?**

## The Solution: Numbers (Vectors)

Embeddings solve this by translating human concepts into **numbers**. 

An Embedding is simply a list of numbers (a vector) that represents the *meaning* of a word, a sentence, or a whole document. 

Imagine we have a very simple, 2-dimensional embedding model. We score every word on two metrics from -1 to 1:
1. **Tech-iness:** (Is it related to technology?)
2. **Fruit-iness:** (Is it related to food?)

* **"Microsoft"** might score \`[0.9, -0.8]\` (Very techy, not fruity at all).
* **"Banana"** might score \`[-0.9, 0.9]\` (Not techy at all, very fruity).
* **"Apple"** might score \`[0.8, 0.6]\` (It's a tech company AND it's a fruit!).

By turning words into numbers, we have plotted them on a mathematical graph. Because they are on a graph, the computer can now mathematically calculate the *distance* between the word "Apple" and the word "Microsoft". 

Because the numbers for Apple and Microsoft are close together on the "Tech-iness" axis, the computer suddenly understands that they are semantically related!

> [!NOTE]
> **Real Embeddings are Massive**
> Our example above used 2 dimensions (Tech and Fruit). Real AI embedding models from OpenAI or Google don't use 2 dimensions... they use **1,536 dimensions**! They map words on 1,536 different invisible concepts, allowing them to capture the deepest nuances of human language.

In the next lesson, we will look at how we actually convert text into these massive arrays of numbers!
`;
