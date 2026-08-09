export const outputFormattingContent = `
# Output Formatting (JSON, Markdown, Tables)

When you are building software that uses AI, you cannot have the AI outputting random conversational text like *"Sure, here is your data!"* 

If you are trying to parse the AI's response in your code, you need it to be strictly formatted as JSON, XML, or a CSV. As a Prompt Engineer, controlling the format is half the job.

---

## 1. Structured Data (JSON)

If you are using the OpenAI API, Anthropic API, or Gemini API in your app, you will almost always want the response in JSON.

The best way to guarantee JSON output is to provide the exact JSON schema you want in the prompt (Few-Shot prompting!).

**Example Prompt:**
> "Extract the user's name and age from this text: 'Hi, I'm Sarah and I just turned 29.'
> 
> You must output your response in valid JSON matching this exact schema, with no markdown formatting and no conversational text:
> {
>   "name": "string",
>   "age": "number"
> }"

## 2. Tables and Markdown

If you are generating content for a human to read on a screen, you should force the AI to use Markdown. 

If you want a comparison, don't ask for a list. Ask for a table!

**Example Prompt:**
> "Compare React, Vue, and Angular. Output the result as a Markdown table with the following columns: Framework, Learning Curve, Performance, and Best For."

## 3. The "No Yapping" Rule

AI models are trained to be polite and conversational. They love to say *"Certainly! Here is the table you requested:"* at the beginning, and *"I hope this helps! Let me know if you need anything else."* at the end.

If you are putting the AI's response directly into a UI, this "yapping" looks terrible. 

You must explicitly ban it.

**Example Prompt:**
> "Translate the word 'Hello' to Spanish. Output ONLY the translated word. Do not include any pleasantries, conversational text, or punctuation."
`;
