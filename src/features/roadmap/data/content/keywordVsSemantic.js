export const keywordVsSemanticContent = `
# Keyword vs Semantic Search

Before we had AI and Embeddings, how did we search through thousands of documents to find an answer? We used **Keyword Search**. 

To understand why Embeddings are a massive revolution in software engineering, we have to understand why Keyword Search fails.

---

## The Limitations of Keyword Search

Keyword search (also known as Lexical Search) looks for exact spelling matches. It's the technology behind traditional databases (like SQL \`LIKE '%term%'\`) and older search engines (like Elasticsearch).

Imagine your company has an IT handbook with the following sentence:
> *"If your laptop monitor is broken, contact the hardware department on the 3rd floor."*

A user types the following question into your company's chatbot:
> *"My computer screen is shattered, who do I talk to?"*

**The Keyword Search Failure:**
A keyword search algorithm takes the words "computer", "screen", and "shattered" and scans the handbook looking for those exact words. 

It finds zero results. Why? Because the handbook uses the words "laptop", "monitor", and "broken". 

Even though the *meaning* is exactly the same, keyword search fails because the spelling is different. To fix this, engineers used to spend hundreds of hours writing manual lists of synonyms (screen = monitor, broken = shattered).

## The Power of Semantic Search (Embeddings)

**Semantic Search** completely solves this problem by using Embeddings. We don't search by spelling; we search by *meaning*.

Here is how it works in our IT handbook example:

1. **Pre-processing:** When the handbook was created, we used an Embedding API to turn the sentence *"If your laptop monitor is broken..."* into a massive array of numbers (a vector). We saved those numbers in a database.
2. **The User Query:** The user types *"My computer screen is shattered..."*
3. **Embed the Query:** We take the user's question and send it to the exact same Embedding API. The API returns a vector for the question.
4. **The Magic Math:** Because "laptop" and "computer" mean the same thing, and "broken" and "shattered" mean the same thing, the math algorithm plots both vectors in the exact same spot on the invisible 1,536-dimensional graph!
5. **The Result:** The database calculates that the user's vector and the handbook's vector are mathematically right next to each other. It successfully returns the correct sentence, even though they share zero exact keywords!

> [!IMPORTANT]
> **Semantic Search is Multilingual!**
> Because embeddings capture meaning, not spelling, they naturally understand languages. If the handbook is in English, but the user asks the question in Spanish (*"Mi pantalla está rota"*), the embedding model will STILL plot the Spanish question right next to the English answer on the graph! It is practically magic.

By leveraging Semantic Search, you can build search engines for your apps that are infinitely smarter than traditional SQL databases. In the next lesson, we will look at the exact mathematical formula used to calculate the distance between these vectors.
`;
