export const zeroVsFewShotContent = `
# Zero-Shot vs. Few-Shot Prompting

When you ask an AI to do something it has never explicitly done before, you are using **Zero-Shot Prompting**. When you give the AI a few examples of what you want before asking it to do the task, you are using **Few-Shot Prompting**.

---

## 1. Zero-Shot Prompting

A "shot" simply refers to an example. Zero-shot means you give the AI zero examples. 

You are relying entirely on the AI's pre-trained knowledge to figure out what you want.

**Example of a Zero-Shot Prompt:**
> "Classify the sentiment of this review as Positive, Neutral, or Negative: 
> 'The food was okay, but the service was incredibly slow.'"

Because modern LLMs are so smart, they can usually handle zero-shot prompts for simple tasks perfectly fine. The AI will likely output: \`Negative\`.

## 2. The Problem with Zero-Shot

Zero-shot breaks down when you need a very specific format, tone, or style. 

If you ask: *"Write a product description for our new shoes,"* the AI will write a perfectly fine description. But it won't match your company's specific quirky tone, and it might make the description way too long. 

You could try to explain the tone: *"Write it in a quirky, fun tone, keep it short, use bullet points..."* but often, the AI will still slightly misunderstand your exact vision.

## 3. Few-Shot Prompting (The Cheat Code)

**Show, don't just tell.**

Few-Shot Prompting means providing 1 to 5 examples of exactly what you want *inside* the prompt, before you ask your final question. 

Because the AI is a pattern-matching machine, giving it examples is the single most powerful way to force it into a specific output format.

**Example of a Few-Shot Prompt:**
> "I am going to give you a product, and I want you to write a 1-sentence catchy slogan for it. 
>
> Product: A waterproof jacket
> Slogan: Laugh in the face of rain clouds.
> 
> Product: Noise-cancelling headphones
> Slogan: Your personal mute button for the world.
>
> Product: A heavy-duty coffee thermos
> Slogan: "

By giving the AI two examples ("shots"), you don't even need to explain the tone! The AI instantly recognizes the pattern (short, witty, slightly rebellious) and will generate a perfect slogan for the thermos, like: *"Keep your coffee hotter than your deadlines."*

> [!TIP]
> If the AI is ever struggling to format data the way you want, stop trying to explain it in words. Just give it two examples. It will fix the issue 99% of the time.
`;
