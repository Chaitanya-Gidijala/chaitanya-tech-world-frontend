export const genAiData = {
  id: 'gen-ai',
  title: 'Generative AI & Prompt Engineering',
  description: 'A complete, industry-oriented Generative AI learning path from Beginner to Production level.',
  phases: [
    {
      id: 'fundamentals',
      title: 'Generative AI Fundamentals',
      topics: [
        { id: 'ai-vs-ml-vs-dl', title: 'AI vs ML vs DL vs Gen AI' },
        { id: 'what-is-gen-ai', title: 'What is Generative AI?' },
        { id: 'next-token-prediction', title: 'The Prediction Engine' },
        { id: 'how-ai-thinks', title: 'How AI "Thinks"' },
        { id: 'tokens-and-context', title: 'Tokens & Context Windows' },
        { id: 'controlling-ai', title: 'Controlling AI (Temp & Top-P)' },
        { id: 'training-vs-inference', title: 'Training vs Inference' },
        { id: 'pretraining-vs-finetuning', title: 'Pre-training vs Fine-tuning' },
        { id: 'hallucinations', title: 'Hallucinations & AI Limitations' },
        { id: 'multimodal-ai', title: 'Multimodal AI' }
      ]
    },
    {
      id: 'prompt-engineering',
      title: 'Prompt Engineering',
      topics: [
        { id: 'what-is-prompt-engineering', title: 'What is Prompt Engineering?' },
        { id: 'anatomy-of-a-prompt', title: 'Anatomy of a Perfect Prompt' },
        { id: 'zero-vs-few-shot', title: 'Zero vs One vs Few-Shot' },
        { id: 'act-as-technique', title: 'Role Prompting (Act As...)' },
        { id: 'chain-of-thought', title: 'Chain of Thought (CoT)' },
        { id: 'output-formatting', title: 'Output Formatting' },
        { id: 'positive-negative-instructions', title: 'Positive & Negative Instructions' },
        { id: 'prompt-templates', title: 'Prompt Templates & Reusability' },
        { id: 'prompt-chaining', title: 'Prompt Chaining' },
        { id: 'common-prompting-mistakes', title: 'Common Prompting Mistakes' }
      ]
    },
    {
      id: 'llm-apis',
      title: 'LLM APIs & App Development',
      topics: [
        { id: 'intro-to-llm-apis', title: 'Intro to LLM APIs' },
        { id: 'request-response-lifecycle', title: 'Request/Response Lifecycle' },
        { id: 'chat-vs-completions', title: 'Chat vs Completions & Messages' },
        { id: 'streaming-responses', title: 'Streaming Responses' },
        { id: 'structured-outputs', title: 'Structured Outputs & JSON' },
        { id: 'token-usage-cost', title: 'Token Usage & Cost Calculation' },
        { id: 'context-management', title: 'Context Management' },
        { id: 'rate-limits-retries', title: 'Handling Rate Limits & Retries' }
      ]
    },
    {
      id: 'embeddings-semantic-search',
      title: 'Embeddings & Semantic Search',
      topics: [
        { id: 'what-are-embeddings', title: 'What are Embeddings?' },
        { id: 'text-to-vector', title: 'Text to Vector Conversion' },
        { id: 'keyword-vs-semantic', title: 'Keyword vs Semantic Search' },
        { id: 'cosine-similarity', title: 'Vector Similarity (Cosine)' },
        { id: 'embedding-models', title: 'Embedding Models Overview' }
      ]
    },
    {
      id: 'vector-databases',
      title: 'Vector Databases',
      topics: [
        { id: 'what-is-vector-db', title: 'What is a Vector Database?' },
        { id: 'vector-vs-sql', title: 'Traditional SQL vs Vector DB' },
        { id: 'vector-indexing', title: 'Vector Indexing & Search' },
        { id: 'collections-metadata', title: 'Collections & Metadata Filtering' },
        { id: 'popular-vector-dbs', title: 'Popular Vector DBs Overview' }
      ]
    },
    {
      id: 'rag',
      title: 'Retrieval-Augmented Generation (RAG)',
      topics: [
        { id: 'providing-context', title: 'What is RAG & Why do we need it?' },
        { id: 'rag-architecture', title: 'RAG Architecture Overview' },
        { id: 'document-ingestion', title: 'Document Ingestion & Loading' },
        { id: 'text-extraction-chunking', title: 'Text Extraction & Chunking' },
        { id: 'embedding-generation-storage', title: 'Embedding Generation & Storage' },
        { id: 'retrieval-context-injection', title: 'Retrieval & Context Injection' },
        { id: 'generation-grounding', title: 'Generation & Grounding' },
        { id: 'advanced-rag-metadata', title: 'Advanced: Metadata & Hybrid Search' },
        { id: 'advanced-rag-reranking', title: 'Advanced: Re-ranking & Transforms' },
        { id: 'advanced-rag-multiquery', title: 'Advanced: Multi-query & Parent-child' },
        { id: 'rag-vs-long-context', title: 'RAG vs Long Context Windows' }
      ]
    },
    {
      id: 'fine-tuning',
      title: 'Fine-Tuning & Model Customization',
      topics: [
        { id: 'prompting-vs-rag-vs-finetuning', title: 'Prompting vs RAG vs Fine-Tuning' },
        { id: 'when-to-finetune', title: 'When to Use (and NOT Use) Fine-Tuning' },
        { id: 'dataset-preparation', title: 'Dataset Preparation' },
        { id: 'supervised-finetuning', title: 'Supervised Fine-Tuning (SFT)' },
        { id: 'lora-peft', title: 'LoRA & PEFT' },
        { id: 'finetuning-limitations', title: 'Fine-Tuning Limitations & Costs' }
      ]
    },
    {
      id: 'ai-agents',
      title: 'AI Agents & Tool Calling',
      topics: [
        { id: 'what-is-an-agent', title: 'What is an AI Agent?' },
        { id: 'chatbot-vs-agent', title: 'LLM vs Chatbot vs Agent' },
        { id: 'agent-architecture', title: 'Agent Architecture Overview' },
        { id: 'function-calling-basics', title: 'Function/Tool Calling Basics' },
        { id: 'tool-selection-execution', title: 'Tool Selection & Execution' },
        { id: 'agent-memory', title: 'Agent Memory (Short vs Long)' },
        { id: 'multi-step-workflows', title: 'Multi-step Tasks & Workflows' },
        { id: 'multi-agent-systems', title: 'Multi-Agent Systems (HITL)' },
        { id: 'handling-agent-failures', title: 'Handling Agent Failures' }
      ]
    },
    {
      id: 'mcp',
      title: 'MCP (Model Context Protocol)',
      topics: [
        { id: 'intro-to-mcp', title: 'What is MCP & Why use it?' },
        { id: 'mcp-architecture', title: 'MCP Architecture Deep Dive' },
        { id: 'building-mcp-server', title: 'Building a Simple MCP Server' },
        { id: 'building-mcp-client', title: 'Building an MCP Client' },
        { id: 'function-calling-vs-mcp', title: 'Function Calling vs MCP' },
        { id: 'mcp-security', title: 'MCP Security & Authentication' },
        { id: 'mcp-examples', title: 'Real-world MCP Examples' }
      ]
    },
    {
      id: 'ai-frameworks',
      title: 'AI Frameworks',
      topics: [
        { id: 'frameworks-overview', title: 'Overview of AI Frameworks' },
        { id: 'langchain-langgraph', title: 'LangChain & LangGraph' },
        { id: 'llamaindex', title: 'LlamaIndex' },
        { id: 'spring-ai-intro', title: 'Spring AI (Intro)' },
        { id: 'frameworks-vs-custom', title: 'Frameworks vs Custom Code' }
      ]
    },
    {
      id: 'gen-ai-java-spring',
      title: 'Gen AI with Java & Spring Boot',
      topics: [
        { id: 'spring-llm-apis', title: 'Integrating LLM APIs with Spring' },
        { id: 'spring-prompt-templates', title: 'Spring AI: Prompt Templates' },
        { id: 'spring-streaming', title: 'Spring AI: Streaming Responses' },
        { id: 'spring-function-calling', title: 'Spring AI: Function Calling' },
        { id: 'spring-embeddings', title: 'Spring AI: Embeddings & Vector DBs' },
        { id: 'spring-rag-app', title: 'Building a Spring Boot RAG App' },
        { id: 'spring-chat-memory', title: 'Chat Memory & Tool Calling' },
        { id: 'spring-java-agents', title: 'Java AI Agents & MCP Integration' },
        { id: 'spring-exception-handling', title: 'Exception Handling & API Security' }
      ]
    },
    {
      id: 'gen-ai-evaluation',
      title: 'Gen AI Evaluation',
      topics: [
        { id: 'evaluation-difficulty', title: 'Why Evaluating LLMs is Difficult' },
        { id: 'accuracy-relevance', title: 'Accuracy, Relevance & Faithfulness' },
        { id: 'hallucination-toxicity', title: 'Hallucinations, Toxicity & Bias' },
        { id: 'automated-vs-human', title: 'Automated vs Human (LLM-as-a-judge)' },
        { id: 'prompt-rag-agent-eval', title: 'Prompt, RAG & Agent Evaluation' },
        { id: 'evaluation-datasets', title: 'Evaluation Datasets & Regression' }
      ]
    },
    {
      id: 'responsible-ai-security',
      title: 'Responsible AI & Security',
      topics: [
        { id: 'ai-safety-bias', title: 'AI Safety, Bias & Privacy' },
        { id: 'prompt-injection', title: 'Prompt Injection & Jailbreaking' },
        { id: 'indirect-prompt-injection', title: 'Indirect Injection & Data Poisoning' },
        { id: 'data-leakage', title: 'Data Leakage & PII Protection' },
        { id: 'secure-tool-calling', title: 'Secure Tool Calling & Excessive Agency' },
        { id: 'output-validation', title: 'Output Validation & Human Oversight' }
      ]
    },
    {
      id: 'production-gen-ai',
      title: 'Production Gen AI',
      topics: [
        { id: 'production-architecture', title: 'Production Architecture & Scaling' },
        { id: 'latency-token-optimization', title: 'Latency & Token Optimization' },
        { id: 'cost-optimization', title: 'Cost Optimization & Model Routing' },
        { id: 'caching-fallback', title: 'Caching & Fallback Models' },
        { id: 'observability', title: 'Observability (Logging, Monitoring)' },
        { id: 'cicd-cloud-deployment', title: 'CI/CD & Cloud Deployment' }
      ]
    },
    {
      id: 'advanced-concepts',
      title: 'Advanced Gen AI Concepts',
      topics: [
        { id: 'transformer-basics', title: 'Transformer Architecture Basics' },
        { id: 'attention-mechanism', title: 'Attention Mechanism & Self-Attention' },
        { id: 'encoder-vs-decoder', title: 'Encoder vs Decoder' },
        { id: 'parameters-quantization', title: 'Model Parameters & Quantization' },
        { id: 'open-vs-closed-llms', title: 'Open vs Closed LLMs (Local LLMs)' },
        { id: 'advanced-reasoning-moe', title: 'Advanced Reasoning & MoE' }
      ]
    },
    {
      id: 'real-world-projects',
      title: 'Real-World Projects',
      topics: [
        { id: 'project-beginner', title: 'Beginner: AI Text Summarizer' },
        { id: 'project-intermediate', title: 'Intermediate: Document Q&A / PDF Chatbot' },
        { id: 'project-advanced', title: 'Advanced: Spring Boot RAG App' },
        { id: 'project-production', title: 'Production: Enterprise Knowledge Assistant' }
      ]
    },
    {
      id: 'interview-prep',
      title: 'Gen AI Interview & Certification Prep',
      topics: [
        { id: 'interview-fundamentals', title: 'Gen AI Fundamentals Questions' },
        { id: 'interview-prompt-engineering', title: 'Prompt Engineering Questions' },
        { id: 'interview-rag-vector', title: 'RAG, Embeddings & Vector DB Questions' },
        { id: 'interview-finetuning-agents', title: 'Fine-Tuning & Agents Questions' },
        { id: 'interview-security-production', title: 'Security, Evaluation & Production' },
        { id: 'interview-architecture', title: 'Scenario-based Architecture Questions' }
      ]
    }
  ]
};
