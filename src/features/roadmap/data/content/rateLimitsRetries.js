export const rateLimitsRetriesContent = `
# Handling Rate Limits & Retries

In a perfect world, every time you send an API request to OpenAI, Google, or Anthropic, you get a response back instantly. 

In reality, AI infrastructure is under immense global strain. GPUs are the most sought-after hardware on the planet. Because of this, API providers strictly enforce **Rate Limits** to ensure no single developer hogs all the computing power.

If you don't handle these limits in your code, your application will crash spectacularly the moment it gets a spike in traffic.

---

## What is a Rate Limit?

A rate limit is a cap on how much you can use an API within a certain timeframe. LLM providers typically track two types of limits simultaneously:

1. **RPM (Requests Per Minute):** How many individual API calls you make.
2. **TPM (Tokens Per Minute):** The total sum of input and output tokens across all your requests.

If you exceed *either* of these limits, the provider will reject your request and return an HTTP Error Status Code: \`429 Too Many Requests\`.

## The Problem: The Brittle App

Imagine you build an AI application that generates customized marketing emails for your users.
1. A user clicks "Generate".
2. Your backend makes the API call.
3. OpenAI returns a \`429\` error because you hit your TPM limit for that minute.
4. Your backend code (expecting a nice JSON response with an email) tries to read the error message instead. It throws an exception, crashes, and the user sees a blank white screen.

This is a terrible user experience!

## The Solution: Exponential Backoff

When you get a \`429\` error, it doesn't mean you are banned. It just means you need to wait a few seconds and try again. 

The industry standard way to handle this is an algorithm called **Exponential Backoff**.

Instead of crashing immediately, your code should intercept the \`429\` error and automatically retry the request, but wait a little bit longer each time.

**How Exponential Backoff Works:**
* **Attempt 1:** Request fails. Wait 1 second.
* **Attempt 2:** Request fails. Wait 2 seconds.
* **Attempt 3:** Request fails. Wait 4 seconds.
* **Attempt 4:** Request fails. Wait 8 seconds.
* **Attempt 5:** If it still fails, *now* you show a polite error to the user: "Our servers are experiencing high load, please try again in a minute."

By waiting exponentially longer between each retry, you give the API provider's servers time to cool down and reset your quota, dramatically increasing the chance that your request will eventually succeed.

> [!TIP]
> **Use the official SDKs!**
> You don't actually have to write the exponential backoff algorithm yourself! If you use the official Python or Node.js SDKs provided by OpenAI or Anthropic, they have built-in retry logic that automatically handles \`429\` errors under the hood. However, you still need to understand *why* your requests might take 10 seconds instead of 2 seconds during peak hours!

That concludes Phase 3. You now understand the mechanics of talking to LLM APIs. In Phase 4, we are going to learn how to give our AI a long-term memory using **Embeddings**!
`;
