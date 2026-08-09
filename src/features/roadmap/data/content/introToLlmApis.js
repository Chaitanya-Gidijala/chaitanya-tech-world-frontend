export const introToLlmApisContent = `
# Intro to LLM APIs

Welcome to Phase 3! So far, we've talked about how LLMs work in theory and how to talk to them via a chat interface like ChatGPT. 

But as a developer, you don't want to type into a website. You want your *code* to talk to the AI. You want to build applications! To do this, we use **APIs (Application Programming Interfaces)**.

---

## What is an LLM API?

An LLM API is a bridge that allows your code (whether it's Python, Java, JavaScript, or anything else) to send a prompt directly to a server running a massive AI model, and get the response back directly into your code.

Think of it like ordering food at a restaurant:
* **You (The Developer):** The customer looking at the menu.
* **The API:** The waiter who takes your order to the kitchen.
* **The LLM (The Model):** The chef in the kitchen who actually cooks the meal.
* **The Response:** The waiter bringing the food back to your table.

## The Big Players

While there are hundreds of models out there, as a developer, you will likely interact with one of these major API providers:

1. **OpenAI API:** The most popular. Provides access to \`gpt-4o\`, \`gpt-4o-mini\`, and their embedding models.
2. **Anthropic API:** Providers of the Claude models (\`claude-3-5-sonnet\`), known for incredible coding and reasoning abilities.
3. **Google Gemini API:** Provides access to the Gemini family of models (\`gemini-1.5-pro\`, \`gemini-1.5-flash\`), known for massive context windows (up to 2 million tokens!).
4. **Open-Source Providers (Groq, Together AI):** These APIs host open-source models like Meta's \`Llama 3\` but provide them via an API so you don't have to run them on your own hardware. Groq is famous for being unbelievably fast.

## How do you authenticate?

You can't just send requests to these APIs for free (remember, inference costs them money!). 

To use an LLM API, you need an **API Key**. 
An API key is a long, secret string of text (e.g., \`sk-proj-123456789...\`) that acts as your password. You include this key in every request your code makes. 

> [!CAUTION]
> **Never commit your API key to GitHub!**
> If you accidentally push your API key to a public repository, bots will scrape it within seconds and use your account to generate thousands of dollars of AI requests. Always use environment variables (like a \`.env\` file) to keep your keys safe!

## The Anatomy of an API Request

When your code makes a request to an LLM API, you are typically sending a JSON object that looks something like this:

\`\`\`json
{
  "model": "gpt-4o-mini",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 0.7,
  "max_tokens": 100
}
\`\`\`

Notice how all the concepts we learned in Phase 1 and 2 (Temperature, Max Tokens, System Prompts) map directly to the JSON parameters in the API call!

In the next lesson, we will look at exactly how this Request and Response lifecycle plays out over the network.
`;
