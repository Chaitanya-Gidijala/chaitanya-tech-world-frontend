export const howAiThinksContent = `
# How AI "Thinks": Neural Networks Simplified

We just learned that AI predicts the next word. But how does it know that "store" follows "grocery" and not "banana"? 

It doesn't use a giant dictionary. It uses a **Neural Network**—a software structure inspired by the human brain.

---

<img src="/assets/gen_ai_neural_net.jpg" alt="Diagram showing a Neural Network" className="tutorial-diagram" />
<p className="tutorial-caption">A neural network consists of an input layer (your prompt), hidden layers (where the "thinking" and pattern matching happens), and an output layer (the generated word).</p>

---

## 1. The Giant Web of Connections

During its training phase, an AI reads billions of web pages, books, and articles. 

As it reads, it builds a massive web of connections between concepts. It learns that the concept of "King" is related to "Man", and "Queen" is related to "Woman". It learns that "Python" is related to both "Snakes" and "Programming", depending on the surrounding words.

These connections are stored as numbers (called **parameters** or **weights**) inside the Neural Network. When you hear that an AI has "70 Billion Parameters", it means there are 70 billion mathematical connections determining how concepts relate to one another!

## 2. The Illusion of Reasoning

When you ask an AI a complex logic puzzle, and it gets it right, it feels like the AI is reasoning through the problem just like you would. 

**It is not.**

The AI is simply traversing its massive web of billions of connections to find the pattern of words that most accurately resembles a correct answer to your puzzle. It has seen similar logic puzzles in its training data, so it mathematically predicts the words that solve it.

This is why AI can sometimes confidently give you a completely wrong answer (a **hallucination**). It doesn't actually *understand* facts; it just understands which words usually look good next to each other!

## 3. Guiding the Network

If the AI is just a giant web of connections, your job as a Prompt Engineer is to "light up" the correct part of the web. 

If you want the AI to write a Python script, you shouldn't just ask it for code. You should use words in your prompt like "Software Engineering", "Clean Code", "PEP8 formatting", and "Optimized". These keywords act like beacons, lighting up the highly-professional programming sectors of the AI's neural network, ensuring the words it predicts next come from the "expert coder" part of its brain, rather than the "amateur coder" part.
`;
