export const claudeDeveloperData = {
  id: 'claude-certified-developer',
  slug: 'claude-certified-developer',
  shortName: 'CCD',
  fullName: 'Claude Certified Developer',
  provider: 'Anthropic',
  level: 'Developer',
  examCode: 'CCD',
  estimatedHours: 60,
  totalResources: 62,
  passScore: 75,
  examDuration: '120 min',
  questionCount: 65,
  color: '#8B5CF6',
  accentColor: '#A78BFA',
  gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  description: 'Learn to build Claude-powered applications with the Anthropic API — RAG pipelines, multi-agent systems, tool use, streaming, and production-ready integrations.',
  domains: [
    {
      id: 'domain-1',
      number: 1,
      weight: 18,
      title: 'Context Engineering & Prompting',
      icon: '🧠',
      color: '#6366F1',
      priority: 'high',
      description: 'Mastering context management, summarization, pruning, and optimizing prompts with caching for long-running conversations.',
      topicsToLearn: ['Context Compaction', 'Prompt Caching', 'Context Pruning', 'System Prompts', 'Temperature vs Context'],
      importantConcepts: [
        'Context Compaction vs Truncation and Summarization',
        'Prompt Caching to reduce latency and cost for stable context',
        'Temperature controls randomness, context window dictates information processed',
        'Prompt version control and iterative refinement'
      ],
      practicalSkills: [
        'Implement prompt caching for a multi-turn conversation',
        'Write an agent script to compact older context',
        'Structure a CLAUDE.md file for project instructions'
      ],
      objectives: [
        {
          title: 'Context Engineering Mastery',
          resources: [
            { label: 'Anthropic Docs: Prompt Caching', url: 'https://docs.anthropic.com/' },
            { label: 'Guide: Context Compaction Strategy', url: 'https://docs.anthropic.com/' }
          ]
        },
        {
          title: 'Advanced Prompting Techniques',
          resources: [
            { label: 'Anthropic Cookbook: Prompt Engineering', url: 'https://github.com/anthropics/anthropic-cookbook' }
          ]
        }
      ]
    },
    {
      id: 'domain-2',
      number: 2,
      weight: 16,
      title: 'Tool Use & Structured Outputs',
      icon: '🛠️',
      color: '#EC4899',
      priority: 'high',
      description: 'Building custom tools, avoiding overlapping tool schemas, and forcing Claude to output strictly validated JSON.',
      topicsToLearn: ['Tool Schemas', 'Output Validation', 'Format Drift', 'Tool Dispatch', 'JSON Outputs'],
      importantConcepts: [
        'Defining clear tool schemas and descriptions to avoid misselection',
        'Validation before accepting model output (Retry mechanisms)',
        'Managing Tool-use blocks and avoiding format drift',
        'Handling tool execution errors gracefully'
      ],
      practicalSkills: [
        'Define a custom tool schema in JSON for Claude API',
        'Implement a retry loop for invalid JSON output',
        'Dispatch tool calls to local functions based on Claude responses'
      ],
      objectives: [
        {
          title: 'Implementing Tool Calling',
          resources: [
            { label: 'Anthropic Docs: Tool Use', url: 'https://docs.anthropic.com/en/docs/tool-use' }
          ]
        },
        {
          title: 'Structured Output Validation',
          resources: [
            { label: 'Cookbook: Forcing JSON output', url: 'https://github.com/anthropics/anthropic-cookbook' }
          ]
        }
      ]
    },
    {
      id: 'domain-3',
      number: 3,
      weight: 15,
      title: 'Agents & Agentic Architecture',
      icon: '🤖',
      color: '#10B981',
      priority: 'high',
      description: 'Designing autonomous agent loops, orchestrators, and managing state across long-running tasks via checkpointing.',
      topicsToLearn: ['Agent Orchestration', 'Checkpointing', 'Multi-agent Systems', 'Human Approval', 'State Management'],
      importantConcepts: [
        'Orchestrator vs Subagent architecture',
        'Checkpointing long-running agents to resume after failure',
        'Managing agent loops without infinite loops',
        'Delegating specialized tasks to subagents'
      ],
      practicalSkills: [
        'Build a simple orchestrator agent loop',
        'Implement state checkpointing for a multi-step task',
        'Add a human-in-the-loop approval step to an agent'
      ],
      objectives: [
        {
          title: 'Building Agentic Workflows',
          resources: [
            { label: 'Anthropic Guide: Building Agents', url: 'https://docs.anthropic.com/' }
          ]
        }
      ]
    },
    {
      id: 'domain-4',
      number: 4,
      weight: 14,
      title: 'Model Context Protocol (MCP) & Skills',
      icon: '🔌',
      color: '#F59E0B',
      priority: 'high',
      description: 'Understanding the Model Context Protocol, building reusable MCP servers and skills for extending Claude.',
      topicsToLearn: ['MCP Servers', 'MCP Skills', 'Reusable Capabilities', 'Plugin Management', 'Claude Code'],
      importantConcepts: [
        'When to use MCP vs regular Tools vs Skills',
        'Separating MCP servers for reusable architectures',
        'Managing plugin versions to avoid regressions',
        'Using Claude Code skills for CLI interactions'
      ],
      practicalSkills: [
        'Set up a basic MCP server',
        'Integrate an external API using MCP',
        'Manage Claude Code plugin versions'
      ],
      objectives: [
        {
          title: 'Model Context Protocol (MCP)',
          resources: [
            { label: 'Anthropic MCP Documentation', url: 'https://docs.anthropic.com/' }
          ]
        }
      ]
    },
    {
      id: 'domain-5',
      number: 5,
      weight: 12,
      title: 'Claude SDK, API & Batch Processing',
      icon: '💻',
      color: '#3B82F6',
      priority: 'medium',
      description: 'Mastering the Messages API, Async SDK, and Batch API for large-scale operations.',
      topicsToLearn: ['Messages API', 'Async Client', 'Batch API', 'API Auth', 'Request Handling'],
      importantConcepts: [
        'When to use Batch API (cost/throughput) vs Synchronous API (latency)',
        'Understanding input/output tokens in Messages API',
        'Managing API request/response lifecycle efficiently',
        'Handling rate limits and retries using the official SDK'
      ],
      practicalSkills: [
        'Submit a large workload using the Batch API',
        'Use the async Python/Node SDK for parallel processing',
        'Implement error handling for rate limits'
      ],
      objectives: [
        {
          title: 'API Fundamentals',
          resources: [
            { label: 'Messages API Reference', url: 'https://docs.anthropic.com/' }
          ]
        },
        {
          title: 'Batch API Integration',
          resources: [
            { label: 'Guide: Using the Batch API', url: 'https://docs.anthropic.com/' }
          ]
        }
      ]
    },
    {
      id: 'domain-6',
      number: 6,
      weight: 10,
      title: 'Guardrails, Safety & Security',
      icon: '🛡️',
      color: '#EF4444',
      priority: 'high',
      description: 'Implementing multi-layered safety guardrails, hooks, and strict security practices for production apps.',
      topicsToLearn: ['Hooks', 'Approval Workflows', 'PII Redaction', 'Data Boundaries', 'Multiple Guardrails'],
      importantConcepts: [
        'Multiple layers of guardrails (input/output validation, human approval)',
        'Using Hooks to intercept actions and block dangerous operations',
        'API key management and avoiding committing secrets',
        'Data residency and BYOC/Self-hosting options'
      ],
      practicalSkills: [
        'Implement a Hook to validate database queries before execution',
        'Set up a PII filtering step on user input',
        'Use a secrets manager in a Claude application'
      ],
      objectives: [
        {
          title: 'Application Security',
          resources: [
            { label: 'Anthropic Trust & Safety', url: 'https://www.anthropic.com/trust-and-safety' }
          ]
        }
      ]
    },
    {
      id: 'domain-7',
      number: 7,
      weight: 8,
      title: 'Model Selection & Cost Optimization',
      icon: '💰',
      color: '#10B981',
      priority: 'medium',
      description: 'Choosing the right Claude model family and optimizing token usage for ROI.',
      topicsToLearn: ['Model Families', 'Cost Modeling', 'Extended Thinking', 'Token Tracking', 'Latency vs Quality'],
      importantConcepts: [
        'Selecting models based on quality, latency, cost, and context size',
        'When to use Extended Thinking for complex reasoning vs fast smaller models',
        'Tracking input/output tokens and calculating cost per feature',
        'Prompt caching impact on cost modeling'
      ],
      practicalSkills: [
        'Calculate cost estimates for a feature based on token volume',
        'Toggle Extended Thinking for a complex math/logic prompt',
        'A/B test Haiku vs Sonnet for a specific classification task'
      ],
      objectives: [
        {
          title: 'Model Capabilities',
          resources: [
            { label: 'Claude Model Family Overview', url: 'https://docs.anthropic.com/' }
          ]
        }
      ]
    },
    {
      id: 'domain-8',
      number: 8,
      weight: 7,
      title: 'Operations, Evaluation & Testing',
      icon: '📊',
      color: '#8B5CF6',
      priority: 'medium',
      description: 'Testing models, tracking production traces, and managing deployments.',
      topicsToLearn: ['Evaluation Datasets', 'Regression Testing', 'Observability', 'Production Traces', 'Rollbacks'],
      importantConcepts: [
        'Building representative evaluation datasets for prompts',
        'Monitoring production traces to diagnose failures',
        'Evaluating output quality and preventing prompt regressions',
        'Using feature flags for model or prompt version rollbacks'
      ],
      practicalSkills: [
        'Set up a basic LLM evaluation script',
        'Log production traces with input/output payloads',
        'Compare two prompt versions against a golden dataset'
      ],
      objectives: [
        {
          title: 'Evaluation and Observability',
          resources: [
            { label: 'Cookbook: Evaluating LLMs', url: 'https://github.com/anthropics/anthropic-cookbook' }
          ]
        }
      ]
    }
  ]
};
