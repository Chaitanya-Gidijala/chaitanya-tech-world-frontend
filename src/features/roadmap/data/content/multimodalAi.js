export const multimodalAiContent = `
# Multimodal AI: Beyond Just Text

For a long time, AI models were **Unimodal**—they could only read text and write text. 

But humans don't just communicate in text. We use our eyes and ears. Modern Generative AI is **Multimodal**, meaning it can process and generate multiple modes of data simultaneously.

---

<img src="/assets/gen_ai_multimodal.jpg" alt="Diagram showing Multimodal AI" className="tutorial-diagram" />
<p className="tutorial-caption">A multimodal AI can take in an image, a voice recording, and text all at the same time, and generate a response using any combination of them.</p>

---

## 1. How Does it See and Hear?

You might be wondering: *"I thought the Neural Network only predicted text tokens? How does it look at a picture?"*

It uses the exact same trick! 
Instead of chopping a word into text tokens, it chops an image into **visual tokens** (tiny squares of pixels). It chops an audio file into **audio tokens** (tiny slices of sound waves). 

To the core Neural Network, it's all just numbers. It learns the mathematical relationship between the visual tokens of a "dog" and the text tokens of the word "dog." 

## 2. Real-World Multimodal Workflows

Because the AI can natively understand all these formats, you can do incredible things:

*   **Image to Text:** You take a photo of the ingredients in your fridge. You prompt the AI: *"What dinner can I make with these?"* The AI "sees" the chicken, broccoli, and soy sauce, and writes out a stir-fry recipe.
*   **Audio to Code:** You speak into your phone: *"Build a simple red button that says click me using HTML."* The AI converts your voice to tokens, and outputs HTML code.
*   **Text to Image:** You prompt: *"A futuristic city in the style of cyberpunk."* The AI predicts visual tokens and renders a stunning, completely original image.

## 3. The Future is Multimodal

As Prompt Engineers, we are no longer just writing text prompts. We are designing **multimodal prompts**. 

If you are trying to get an AI to recreate a website's layout, you shouldn't spend 20 minutes describing the layout in text. You should just take a screenshot, upload it to the AI, and say: *"Write the CSS to recreate this image."* 
`;
