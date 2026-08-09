export const content = `
# Prompt Templates & Reusability

If you are building an application with Generative AI, you cannot hardcode a new prompt every time a user wants to do something. That would be impossible!

Instead, we use **Prompt Templates**. 

---

## What is a Prompt Template?

A prompt template is basically a recipe with blank spaces. It contains the static instructions (the rules, the negative instructions, the tone) and placeholders for dynamic data (the user's input).

If you have ever done string interpolation in JavaScript (\`Hello \${name}\`) or used a templating engine like Handlebars, you already understand this concept!

### A Simple Example

Imagine you are building an app that translates text into different languages based on what the user selects.

**The Template:**
> You are a professional translator. 
> Translate the following text into **{{TARGET_LANGUAGE}}**.
> Do not include any explanations, just the translation.
> 
> TEXT:
> **{{USER_TEXT}}**

When the user interacts with your app, your code will dynamically inject their choices into those \`{{ }}\` brackets before sending the massive prompt to the AI.

## Why are Templates so Important?

1. **Security:** By separating the instructions from the user's input, you reduce the risk of Prompt Injection (which we will cover in Phase 13).
2. **Consistency:** You guarantee that the AI receives the exact same constraints and formatting rules every single time, regardless of what text the user inputs.
3. **Reusability:** You write the complex instructions once, and reuse them millions of times across your application.

> [!TIP]
> **Separation of Concerns**
> In enterprise AI development, we treat Prompts exactly like we treat Source Code. We store them in separate files, version control them with Git, and use template libraries to inject variables. 

## Best Practices for Templating

* **Use Clear Delimiters:** Use specific characters like \`{{ }}\` or \`[[ ]]\` or XML tags like \`<input>\` to clearly separate the dynamic data from your static instructions. This helps the AI's attention mechanism understand what is a rule vs what is just data.
* **Keep Data at the Bottom:** AI models suffer from "Lost in the Middle" syndrome. If you put a massive block of user text at the top of the prompt, the AI might forget the instructions at the bottom. Always put your strict rules at the very top or the very bottom, and the dynamic data in the middle or just before the final command.

In the upcoming phases when we look at LangChain and Spring AI, you will see that they have built-in classes specifically for managing these templates programmatically!
`;
