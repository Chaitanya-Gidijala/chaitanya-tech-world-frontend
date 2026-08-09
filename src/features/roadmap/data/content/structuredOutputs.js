export const structuredOutputsContent = `
# Structured Outputs & JSON

When a human uses an LLM (like typing into ChatGPT), they want a nice, formatted, easy-to-read text response. 

However, when you are building a **software application** that uses an LLM API, plain text is your worst enemy. 

If you ask the AI to extract a date, and it replies with *"Sure! The date you requested is October 12th!"*, your backend code will crash when it tries to save that entire sentence into a SQL \`DATETIME\` column. Your code needs structured data, not conversational English.

This is where **Structured Outputs (JSON Mode)** comes in.

---

## The JSON Format

JSON (JavaScript Object Notation) is the universal language that modern web applications use to communicate. It structures data into clear keys and values.

**Instead of this text:**
*"John Doe is 34 years old and works at Google as an Engineer."*

**Your code wants this JSON:**
\`\`\`json
{
  "name": "John Doe",
  "age": 34,
  "company": "Google",
  "role": "Engineer"
}
\`\`\`

## How to Force Structured Outputs

Historically, developers had to use complex Prompt Engineering (Negative Instructions) to beg the AI to output JSON. 

* *"Output ONLY JSON. Do not include markdown backticks. Do not include pleasantries. If you output anything other than JSON, my code will break."*

Even with strict prompts, the AI would occasionally hallucinate a comma or add conversational text, breaking the application.

### The Modern Solution: JSON Mode & Structured Outputs API

Recently, major providers (like OpenAI and Anthropic) introduced native **JSON Mode** and **Structured Outputs** directly into their APIs.

Instead of just hoping the AI follows your prompt, you actually send a strict **JSON Schema** in your API request. The API provider enforces this schema at the hardware level, mathematically guaranteeing that the output will exactly match your required structure!

**Example API Request with Structured Outputs:**
\`\`\`json
{
  "model": "gpt-4o",
  "messages": [
    {"role": "user", "content": "John Doe is 34 and works at Google."}
  ],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "user_extraction",
      "schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "age": {"type": "integer"},
          "company": {"type": "string"}
        },
        "required": ["name", "age", "company"],
        "additionalProperties": false
      },
      "strict": true
    }
  }
}
\`\`\`

> [!TIP]
> **The Secret to Reliable AI Apps**
> If your AI application is interacting with a database, a backend API, or a UI component, you MUST use Structured Outputs. Never try to parse raw conversational text with Regex!

By mastering Structured Outputs, you transition from building "chatbots" to building robust, deterministic AI software systems.
`;
