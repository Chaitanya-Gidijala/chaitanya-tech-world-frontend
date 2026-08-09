export const cosineSimilarityContent = `
# Cosine Similarity (The Math)

We know that embeddings plot text as points on a massive 1,536-dimensional graph. And we know that to find the most relevant answer to a user's question, we need to find the vectors that are "closest" together on that graph.

But how do you mathematically calculate the distance between two points in 1,536 dimensions? 

As developers, we use an algorithm called **Cosine Similarity**.

---

## What is Cosine Similarity?

If you remember high school geometry, you might remember calculating the distance between two points on an X/Y graph using the Pythagorean theorem. 

When dealing with AI vectors, we don't actually care about the physical distance between the points. We care about the **angle** between the two lines pointing to those points.

**Cosine Similarity measures the cosine of the angle between two vectors.**

* If the two vectors point in the exact same direction (an angle of 0 degrees), the Cosine Similarity is **1.0**. (This means the text is identical in meaning).
* If the two vectors point at a 90-degree angle, the Cosine Similarity is **0.0**. (This means the text is completely unrelated).
* If the two vectors point in exactly opposite directions, the Cosine Similarity is **-1.0**. (This means the text has the exact opposite meaning).

## Why is it so fast?

You might be thinking: *"If I have 1 million documents in my database, and a user asks a question, doesn't the computer have to run complex trigonometry 1 million times to find the closest match?"*

Yes, it does! 

But the beautiful thing about Cosine Similarity is that for computers, calculating the dot-product of two arrays of numbers is incredibly highly optimized. Modern CPUs (and especially GPUs) can perform millions of these cosine similarity calculations in a fraction of a millisecond.

> [!TIP]
> **You don't need a math degree!**
> As an AI application developer, you will almost never have to write the Cosine Similarity math formula from scratch. If you use Python, libraries like NumPy or SciPy have it built-in. Better yet, in the next phase, we will learn about **Vector Databases**, which automatically do all of this math for you instantly!

### An Example in Code (Pseudo-code)

If you *were* to write it yourself in Python, it's just a few lines of code:

\`\`\`python
import numpy as np

# Let's say we got these vectors from the OpenAI API
question_vector = [0.1, 0.4, -0.2, ...]
document_vector = [0.12, 0.38, -0.19, ...]

# Calculate Cosine Similarity
similarity_score = np.dot(question_vector, document_vector) / (np.linalg.norm(question_vector) * np.linalg.norm(document_vector))

print(f"Similarity Score: {similarity_score}")
# Output: Similarity Score: 0.94 (A very close match!)
\`\`\`

Whenever you use semantic search, you are running this exact mathematical formula under the hood!
`;
