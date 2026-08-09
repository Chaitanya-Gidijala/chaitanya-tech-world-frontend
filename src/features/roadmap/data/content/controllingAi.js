export const controllingAiContent = `
# Controlling AI: Temperature & Top-P

Now that you know how the AI predicts the next word, there's one more secret: **You can control how crazy or strict its predictions are.**

You do this using a setting called **Temperature**.

---

<img src="/assets/gen_ai_temperature.jpg" alt="Diagram showing AI Temperature" className="tutorial-diagram" />
<p className="tutorial-caption">Low temperature makes the AI strict, predictable, and factual. High temperature makes the AI creative, unpredictable, and divergent.</p>

---

## 1. What is Temperature?

Remember how the AI calculates the probability of the next word? 
*   **"blue"** (98%)
*   **"cloudy"** (1%)
*   **"falling"** (0.01%)

**Temperature is a dial (usually from 0.0 to 1.0) that tells the AI whether it's allowed to take risks.**

### Temperature = 0.0 (Strict & Predictable)
If you set the temperature to 0, you are telling the AI: *"Always, without exception, pick the #1 most probable word."* 
If you ask it the exact same question 10 times, it will give you the exact same answer 10 times. 
**Best for:** Code generation, data extraction, solving math problems, or summarizing legal documents.

### Temperature = 0.7 to 1.0 (Creative & Wild)
If you set the temperature to 0.8, you are telling the AI: *"You don't always have to pick the #1 word. Sometimes pick the #2 or #3 word just to keep things interesting."* 
This makes the output feel much more human, creative, and unpredictable.
**Best for:** Brainstorming, writing stories, writing marketing copy, or generating puns.

## 2. What is Top-P?

You might also see a setting called **Top-P** (or Nucleus Sampling). It does a very similar job to Temperature but in a slightly different way.

Instead of saying "take risks," Top-P says: *"Only pick from a pool of words whose probabilities add up to P."*

If Top-P is 0.9, the AI looks at the top predictions. If the top 5 words add up to a 90% probability, it throws away all the millions of other words in the dictionary and *only* randomly picks from those top 5. It strictly cuts off the "crazy" long-tail words.

> [!TIP]
> **Pro Rule of Thumb:** Never change both Temperature and Top-P at the same time. If you want to tweak creativity, leave Top-P at 1.0 and just change the Temperature!
`;
