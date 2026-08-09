export const embeddingModelsContent = `
# Popular Embedding Models

Just like there are dozens of Chat models (GPT-4, Claude 3, Llama), there are dozens of different Embedding models. 

Choosing the right embedding model is arguably one of the most important architectural decisions you will make when building an AI application. 

---

## The Danger of Changing Models

Here is the most critical rule of embeddings:
> [!CAUTION]
> **You cannot mix and match embedding models!**
> If you embed a 100-page document using OpenAI's \`text-embedding-3-small\` model, and save those vectors to your database... you MUST use that exact same model to embed the user's questions in the future. 
> 
> If you try to embed the user's question using a Google model, and compare it to the OpenAI vectors in your database, it will completely fail. Every model plots words on a entirely different mathematical graph! If you ever decide to switch providers, you have to pay to re-embed your entire database from scratch.

Because of this lock-in, choosing the right model on Day 1 is crucial.

## The Top Embedding Providers

### 1. OpenAI (The Standard)
OpenAI recently released their V3 embedding models:
* \`text-embedding-3-small\`: Incredibly cheap, very fast, 1536 dimensions. This is the default choice for 90% of developers building commercial apps today.
* \`text-embedding-3-large\`: More expensive, captures deeper nuances, up to 3072 dimensions. Best for highly complex legal or medical documents.

### 2. Cohere (The Multilingual Kings)
Cohere is a company specializing in enterprise AI. Their \`embed-multilingual-v3.0\` model is widely considered the absolute best in the industry if your documents are in multiple languages (Spanish, Japanese, Arabic, etc.).

### 3. Open Source / Local (HuggingFace, BGE)
If you are building a top-secret application for an aerospace or defense company, you are probably not allowed to send your documents to OpenAI's servers over the internet. 

In this case, you use open-source embedding models (like the \`BGE\` family from BAAI or \`nomic-embed-text\`). You download the model file to your own server, and run the embeddings locally on your own CPU/GPU for free, ensuring complete data privacy.

## Evaluating Models

How do you know which model is mathematically the best? 

The AI industry relies on a leaderboard called **MTEB (Massive Text Embedding Benchmark)** hosted by HuggingFace. It tests hundreds of models across different tasks (classification, clustering, retrieval) and ranks them. 

Before committing to a model, professional developers always check the MTEB leaderboard to ensure they are picking a top-tier algorithm.

Now that we have our vectors, where do we store them? Standard SQL databases are terrible at running cosine similarity. In Phase 5, we introduce the specialized home for our vectors: **Vector Databases**.
`;
