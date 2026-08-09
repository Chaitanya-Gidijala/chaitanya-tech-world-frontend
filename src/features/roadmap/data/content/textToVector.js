export const textToVectorContent = `
# Text to Vector Conversion

In the previous lesson, we learned that an Embedding is a giant array of numbers (a vector) that represents the semantic meaning of text. 

But how do we actually get those numbers? Do we write them ourselves? No! We use an **Embedding API**.

---

## The Embedding API

Just like we use the Chat API to generate text, LLM providers (like OpenAI, Google, and Cohere) provide a dedicated **Embeddings API**.

Instead of sending a prompt and asking for an essay back, you send a string of text and ask the API to convert it into a vector.

### An Example API Request

Here is what a request to OpenAI's embedding endpoint looks like:

\`\`\`json
{
  "input": "The aerospace industry is adopting AI rapidly.",
  "model": "text-embedding-3-small"
}
\`\`\`

**The Response:**

Instead of returning text, the API returns a massive JSON array of floating-point numbers.

\`\`\`json
{
  "data": [
    {
      "embedding": [
        -0.0069292834,
        -0.005336422,
        -0.045471322,
        // ... (1,533 more numbers) ...
      ]
    }
  ],
  "usage": {
    "prompt_tokens": 8,
    "total_tokens": 8
  }
}
\`\`\`

## What do these numbers mean?

To a human, that array of numbers looks like complete gibberish. You cannot look at the number \`-0.00692\` and understand what concept it represents. 

The exact meaning of each dimension is a "black box" determined by the neural network during its training phase. 

All that matters is that this specific array of 1,536 numbers is a unique mathematical fingerprint for the sentence *"The aerospace industry is adopting AI rapidly."*

## Generating Embeddings for Large Documents

If you have a 100-page corporate PDF that you want the AI to memorize, you do not embed the entire 100 pages into a single vector. If you cram too much text into one vector, the "meaning" gets diluted.

Instead, we use a process called **Chunking**:
1. We read the 100-page PDF into our code.
2. We split (chunk) the text into small paragraphs (e.g., 500 words each).
3. We loop through all the paragraphs.
4. We send each paragraph to the Embeddings API to get its unique vector.
5. We now have hundreds of vectors, each representing a tiny piece of the PDF.

> [!CAUTION]
> **Cost Warning**
> Every time you call the Embeddings API, you are charged per token (just like the Chat API). However, because embedding models are much smaller and faster than Chat models, generating embeddings is incredibly cheap (often pennies per million tokens).

Now that we know how to turn our text into numbers, what do we actually *do* with them? We search them! That is the topic of our next lesson.
`;
