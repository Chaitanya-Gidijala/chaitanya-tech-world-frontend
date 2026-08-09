export const whatIsAnAgentContent = `
# What is an AI Agent?

Welcome to Phase 4: AI Agents & MCP! This is the absolute cutting-edge of Generative AI.

Up until now, we have been talking about AI as a chatbot. You ask a question, it predicts text, and it gives you an answer. 

But what if the AI could actually *do* things?

---

## 1. Chatbots vs. Agents

A **Chatbot** is trapped in a box. If you ask a chatbot *"What is the weather in Tokyo right now?"*, it will say *"I don't have access to real-time information."*

An **AI Agent** has hands. If you ask an agent *"What is the weather in Tokyo?"*, it realizes it doesn't know, so it opens a web browser, goes to weather.com, searches for Tokyo, reads the temperature, and then tells you the answer.

## 2. How do Agents work? (Tool Use)

Agents work through something called **Tool Use** (or Function Calling).

As a developer, you can give the AI a list of tools it is allowed to use. For example, you might give it three tools:
1. \`search_web(query)\`
2. \`read_file(filename)\`
3. \`send_email(to, subject, body)\`

When you prompt the AI, instead of predicting standard text to talk to you, the AI's neural network can predict that it should output a JSON command to trigger a tool!

**The Agent Loop:**
1. **Think:** The AI realizes it needs to send an email, but it doesn't know Bob's email address.
2. **Act:** The AI outputs a command to use the \`read_file("contacts.txt")\` tool.
3. **Observe:** Your software intercepts that command, reads the file, and pastes the contents back into the AI's prompt.
4. **Think:** The AI sees Bob's email in the file.
5. **Act:** The AI outputs a command to use the \`send_email()\` tool.

The AI will loop through Thinking, Acting, and Observing until it completely finishes the task you gave it. It is autonomous!
`;
