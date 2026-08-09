export const contextManagementContent = `
# Context Management

If you have ever used a chatbot and felt like it "forgot" what you said five minutes ago, you have experienced a failure in **Context Management**.

When building applications with LLM APIs, understanding how memory and context work is critical. Let's explore the biggest misconception beginners have about AI APIs.

---

## The Illusion of Memory

When you use ChatGPT, it feels like you are having a continuous conversation. The AI remembers your name, what you asked in the first prompt, and the context of the discussion.

Because of this, many developers assume that the OpenAI or Gemini API works the same way—they assume the API server "remembers" them.

**This is completely false.**

> [!WARNING]
> **LLM APIs are Stateless**
> LLM APIs have zero memory. They do not remember your previous API call. If you send a request saying "My name is John", and then send a completely separate request 5 seconds later saying "What is my name?", the API will have no idea who you are. 

## How to Create Memory

To create the illusion of a continuous conversation, **you (the developer)** must manage the memory yourself. 

Every single time you send a request to the API, you must send the *entire history of the conversation* along with the new question. 

### Example of Context Management

**Turn 1:**
You send the system prompt and the user's first question.
\`\`\`json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hi, my name is Alice."}
  ]
}
\`\`\`
*The AI responds: "Hello Alice! How can I help you?"*

**Turn 2:**
Your application must append the AI's response to the array, append the user's new question, and send the *entire array* back to the API.
\`\`\`json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hi, my name is Alice."},
    {"role": "assistant", "content": "Hello Alice! How can I help you?"},
    {"role": "user", "content": "What is my name?"}
  ]
}
\`\`\`
*Because the AI sees the entire transcript, it can confidently answer: "Your name is Alice."*

---

## The Context Window Problem

Managing context seems easy until you run into the **Context Window Limit**.

Every time you append messages and send the entire history back to the API, the payload gets larger and larger.
1. **Cost:** You are charged per token. Sending a massive 10,000-word conversation history over and over again will drain your budget rapidly.
2. **Limits:** Every model has a maximum context window (e.g., 128k tokens for GPT-4o). Once your conversation history exceeds this limit, the API will throw an error and crash.

## Advanced Context Strategies

To solve this, senior AI developers use advanced context management strategies:

1. **Sliding Window:** Only send the most recent 10 messages to the API. Delete the older ones. The AI forgets the distant past, but retains the recent conversation.
2. **Summarization:** When the history gets too long, use a cheap AI model (like gpt-4o-mini) to summarize the first 50 messages into a single short paragraph. Replace the old messages with the summary.
3. **Vector Databases (Long-term Memory):** Store old conversations in a Vector Database and use semantic search to only inject relevant past memories into the prompt when needed (we will cover this deeply in the Vector DB and RAG phases!).
`;
