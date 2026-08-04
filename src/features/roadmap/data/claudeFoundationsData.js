// Claude Certified Associate – Foundations (CCAO-F)
export const claudeFoundationsData = {
  id: 'claude-certified-associate-foundations',
  slug: 'claude-certified-associate-foundations',
  shortName: 'CCAO-F',
  fullName: 'Claude Certified Associate – Foundations',
  provider: 'Anthropic',
  level: 'Associate',
  examCode: 'CCAO-F',
  estimatedHours: 40,
  totalResources: 47,
  passScore: 72,
  examDuration: '120 min',
  questionCount: 65,
  color: '#D97706',
  accentColor: '#F59E0B',
  gradient: 'linear-gradient(135deg, #D97706, #F59E0B, #FCD34D)',
  description:
    'Master the fundamentals of working with Claude AI — from prompt engineering and output validation to governance and workflow integration. This certification validates your ability to effectively leverage Claude for real-world business and technical tasks.',
  domains: [
    {
      id: 'domain-1',
      number: 1,
      weight: 14,
      title: 'Prompting and Task Execution',
      icon: '✍️',
      color: '#6366F1',
      objectives: [
        {
          id: 'obj-1-1',
          title: 'Create effective prompts for business and technical tasks',
          resources: [
            { label: 'Prompt engineering overview', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview' },
            { label: 'Be clear, direct, and detailed', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct' },
            { label: 'Use examples (multishot prompting)', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting' },
            { label: 'Use XML tags to structure your prompts', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags' },
            { label: 'Use prompt templates and variables', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables' },
          ],
        },
        {
          id: 'obj-1-2',
          title: 'Apply task decomposition techniques to structure complex requests',
          resources: [
            { label: 'Chain complex prompts for stronger performance', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/chain-prompts' },
            { label: 'Automatically generate first draft prompt templates', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/prompt-generator' },
            { label: 'Prompting best practices', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices' },
          ],
        },
        {
          id: 'obj-1-3',
          title: 'Iterate prompts to improve output quality',
          resources: [
            { label: 'Use our prompt improver to optimize your prompts', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/prompt-improver' },
            { label: 'Define success criteria and build evaluations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/develop-tests' },
            { label: 'Using the Evaluation Tool', url: 'https://platform.claude.com/docs/en/test-and-evaluate/eval-tool' },
          ],
        },
        {
          id: 'obj-1-4',
          title: 'Adapt prompting strategies based on task type (analysis, research, drafting, brainstorming)',
          resources: [
            { label: 'Prompting best practices', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices' },
            { label: 'Use research on Claude', url: 'https://support.claude.com/en/articles/11088861-use-research-on-claude' },
            { label: 'Chain complex prompts for stronger performance', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/chain-prompts' },
          ],
        },
      ],
    },
    {
      id: 'domain-2',
      number: 2,
      weight: 21,
      title: 'Output Evaluation and Validation',
      icon: '🔍',
      color: '#10B981',
      objectives: [
        {
          id: 'obj-2-1',
          title: 'Evaluate Claude-generated outputs for accuracy and completeness',
          resources: [
            { label: 'Define success criteria and build evaluations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/develop-tests' },
            { label: 'Using the Evaluation Tool', url: 'https://platform.claude.com/docs/en/test-and-evaluate/eval-tool' },
            { label: 'Reduce hallucinations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations' },
          ],
        },
        {
          id: 'obj-2-2',
          title: 'Identify hallucinations, inconsistencies, and biases in responses',
          resources: [
            { label: 'Reduce hallucinations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations' },
            { label: 'Increase output consistency (JSON mode)', url: 'https://docs.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/increase-consistency' },
            { label: 'Define success criteria and build evaluations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/develop-tests' },
          ],
        },
        {
          id: 'obj-2-3',
          title: 'Apply fact-checking and validation techniques',
          resources: [
            { label: 'Reduce hallucinations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations' },
            { label: 'Define your success criteria', url: 'https://platform.claude.com/docs/en/test-and-evaluate/define-success' },
            { label: 'Using the Evaluation Tool', url: 'https://platform.claude.com/docs/en/test-and-evaluate/eval-tool' },
          ],
        },
        {
          id: 'obj-2-4',
          title: 'Determine when human review or additional verification is required',
          resources: [
            { label: 'Reduce hallucinations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations' },
            { label: 'Define success criteria and build evaluations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/develop-tests' },
            { label: 'Usage Policy', url: 'https://www.anthropic.com/legal/aup' },
          ],
        },
        {
          id: 'obj-2-5',
          title: 'Edit, adapt, refine, and compare outputs for the intended audience',
          resources: [
            { label: 'What are artifacts and how do I use them?', url: 'https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them' },
            { label: 'Publish and share artifacts', url: 'https://support.claude.com/en/articles/9547008-publish-and-share-artifacts' },
            { label: 'Prompting best practices', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices' },
          ],
        },
        {
          id: 'obj-2-6',
          title: 'Organize and curate information and select appropriate output formats',
          resources: [
            { label: 'What are artifacts and how do I use them?', url: 'https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them' },
            { label: 'Structured outputs', url: 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs' },
            { label: 'Intro to Artifacts', url: 'https://support.claude.com/en/articles/9945615-intro-to-artifacts' },
          ],
        },
      ],
    },
    {
      id: 'domain-3',
      number: 3,
      weight: 12,
      title: 'Product and Model Selection',
      icon: '🎯',
      color: '#8B5CF6',
      objectives: [
        {
          id: 'obj-3-1',
          title: 'Select appropriate Claude product features (Projects, research mode, chat, artifacts)',
          resources: [
            { label: 'What are projects?', url: 'https://support.claude.com/en/articles/9517075-what-are-projects' },
            { label: 'Use research on Claude', url: 'https://support.claude.com/en/articles/11088861-use-research-on-claude' },
            { label: 'What are artifacts and how do I use them?', url: 'https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them' },
            { label: "Understanding Claude's personalization features", url: 'https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features' },
          ],
        },
        {
          id: 'obj-3-2',
          title: 'Differentiate between Claude model types (Haiku, Sonnet, Opus)',
          resources: [
            { label: 'Choosing the right Claude model: Haiku, Sonnet, Opus, or Fable', url: 'https://claude.com/resources/tutorials/choosing-the-right-claude-model' },
            { label: 'Models overview', url: 'https://platform.claude.com/docs/en/about-claude/models/overview' },
            { label: 'Choosing the right model', url: 'https://platform.claude.com/docs/en/about-claude/models/choosing-a-model' },
          ],
        },
        {
          id: 'obj-3-3',
          title: 'Align model selection with task requirements (cost, speed, quality)',
          resources: [
            { label: 'Choosing the right Claude model: Haiku, Sonnet, Opus, or Fable', url: 'https://claude.com/resources/tutorials/choosing-the-right-claude-model' },
            { label: 'Choosing the right model', url: 'https://platform.claude.com/docs/en/about-claude/models/choosing-a-model' },
            { label: 'Models overview', url: 'https://platform.claude.com/docs/en/about-claude/models/overview' },
          ],
        },
        {
          id: 'obj-3-4',
          title: 'Understand and manage context limitations and memory considerations',
          resources: [
            { label: "Use Claude's chat search and memory to build on previous context", url: 'https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context' },
            { label: 'What are projects?', url: 'https://support.claude.com/en/articles/9517075-what-are-projects' },
            { label: "Understanding Claude's personalization features", url: 'https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features' },
          ],
        },
      ],
    },
    {
      id: 'domain-4',
      number: 4,
      weight: 16,
      title: 'Workflow Integration and Solution Design',
      icon: '⚙️',
      color: '#F59E0B',
      objectives: [
        {
          id: 'obj-4-1',
          title: 'Apply Claude to analyze requirements and use cases',
          resources: [
            { label: 'Using Research and Google Workspace', url: 'https://support.claude.com/en/articles/11101545-using-research-and-google-workspace' },
            { label: 'Use research on Claude', url: 'https://support.claude.com/en/articles/11088861-use-research-on-claude' },
            { label: 'What are projects?', url: 'https://support.claude.com/en/articles/9517075-what-are-projects' },
          ],
        },
        {
          id: 'obj-4-2',
          title: 'Leverage Claude for research, planning, and process optimization',
          resources: [
            { label: 'Use research on Claude', url: 'https://support.claude.com/en/articles/11088861-use-research-on-claude' },
            { label: 'Using Research and Google Workspace', url: 'https://support.claude.com/en/articles/11101545-using-research-and-google-workspace' },
            { label: "Use connectors to extend Claude's capabilities", url: 'https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities' },
          ],
        },
        {
          id: 'obj-4-3',
          title: 'Use Claude to support solution design, development, and iteration',
          resources: [
            { label: 'What are artifacts and how do I use them?', url: 'https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them' },
            { label: 'Use our prompt improver to optimize your prompts', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/prompt-improver' },
            { label: 'Chain complex prompts for stronger performance', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/chain-prompts' },
          ],
        },
        {
          id: 'obj-4-4',
          title: 'Integrate Claude into existing workflows to augment or redesign them',
          resources: [
            { label: "Use connectors to extend Claude's capabilities", url: 'https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities' },
            { label: 'Use Claude for Excel', url: 'https://support.claude.com/en/articles/12650343-use-claude-for-excel' },
            { label: 'Claude for Chrome', url: 'https://claude.com/claude-for-chrome' },
          ],
        },
        {
          id: 'obj-4-5',
          title: "Communicate Claude's value and limitations to stakeholders",
          resources: [
            { label: 'Usage Policy', url: 'https://www.anthropic.com/legal/aup' },
            { label: "Claude's Constitution", url: 'https://www.anthropic.com/constitution' },
            { label: 'Choosing the right Claude model', url: 'https://claude.com/resources/tutorials/choosing-the-right-claude-model' },
          ],
        },
      ],
    },
    {
      id: 'domain-5',
      number: 5,
      weight: 12,
      title: 'Configuration and Knowledge Management',
      icon: '🗄️',
      color: '#06B6D4',
      objectives: [
        {
          id: 'obj-5-1',
          title: 'Configure Claude Projects with instructions and knowledge sources',
          resources: [
            { label: 'What are projects?', url: 'https://support.claude.com/en/articles/9517075-what-are-projects' },
            { label: 'How can I create and manage projects?', url: 'https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects' },
            { label: "Understanding Claude's personalization features", url: 'https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features' },
          ],
        },
        {
          id: 'obj-5-2',
          title: 'Manage uploaded knowledge and connectors (e.g., Google Drive, Gmail)',
          resources: [
            { label: 'Use Google Workspace connectors', url: 'https://support.claude.com/en/articles/10166901-use-google-workspace-connectors' },
            { label: "Use connectors to extend Claude's capabilities", url: 'https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities' },
            { label: 'Use the GitHub integration', url: 'https://support.claude.com/en/articles/10167454-use-the-github-integration' },
          ],
        },
        {
          id: 'obj-5-3',
          title: 'Create effective system-level instructions',
          resources: [
            { label: "Understanding Claude's personalization features", url: 'https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features' },
            { label: 'How can I create and manage projects?', url: 'https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects' },
            { label: 'Be clear, direct, and detailed', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct' },
          ],
        },
        {
          id: 'obj-5-4',
          title: 'Inform, maintain, and update Claude configurations, knowledge sources, and instructions',
          resources: [
            { label: 'How can I create and manage projects?', url: 'https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects' },
            { label: 'What are projects?', url: 'https://support.claude.com/en/articles/9517075-what-are-projects' },
            { label: "Use Claude's chat search and memory to build on previous context", url: 'https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context' },
          ],
        },
      ],
    },
    {
      id: 'domain-6',
      number: 6,
      weight: 15,
      title: 'Governance, Risk, and Responsible Use',
      icon: '🛡️',
      color: '#EF4444',
      objectives: [
        {
          id: 'obj-6-1',
          title: 'Identify appropriate and inappropriate use cases',
          resources: [
            { label: 'Usage Policy', url: 'https://www.anthropic.com/legal/aup' },
            { label: 'AI policy', url: 'https://www.anthropic.com/policy' },
            { label: "Claude's Constitution", url: 'https://www.anthropic.com/constitution' },
          ],
        },
        {
          id: 'obj-6-2',
          title: 'Apply data sensitivity, regulatory, and privacy considerations',
          resources: [
            { label: 'I would like to input sensitive data into my chats with Claude.', url: 'https://support.claude.com/en/articles/8325621-i-would-like-to-input-sensitive-data-into-my-chats-with-claude-who-can-view-my-conversations' },
            { label: 'How do I change my model improvement privacy settings?', url: 'https://privacy.claude.com/en/articles/12109829-how-do-i-change-my-model-improvement-privacy-settings' },
            { label: 'Is my data used for model training?', url: 'https://privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training' },
          ],
        },
        {
          id: 'obj-6-3',
          title: 'Follow organizational AI policies and governance standards',
          resources: [
            { label: 'Usage Policy', url: 'https://www.anthropic.com/legal/aup' },
            { label: "Use connectors to extend Claude's capabilities", url: 'https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities' },
            { label: 'How can I create and manage projects?', url: 'https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects' },
          ],
        },
        {
          id: 'obj-6-4',
          title: 'Understand the ethical implications of AI usage',
          resources: [
            { label: "Claude's Constitution", url: 'https://www.anthropic.com/constitution' },
            { label: 'Usage Policy', url: 'https://www.anthropic.com/legal/aup' },
            { label: 'How Do You Use Personal Data in Model Training?', url: 'https://privacy.claude.com/en/articles/10023555-how-do-you-use-personal-data-in-model-training' },
          ],
        },
      ],
    },
    {
      id: 'domain-7',
      number: 7,
      weight: 10,
      title: 'Troubleshooting and Optimization',
      icon: '🔧',
      color: '#EC4899',
      objectives: [
        {
          id: 'obj-7-1',
          title: 'Identify, diagnose, and resolve issues with underperforming prompts or poor outputs',
          resources: [
            { label: 'Use our prompt improver to optimize your prompts', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/prompt-improver' },
            { label: 'Reduce hallucinations', url: 'https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations' },
            { label: 'Using the Evaluation Tool', url: 'https://platform.claude.com/docs/en/test-and-evaluate/eval-tool' },
          ],
        },
        {
          id: 'obj-7-2',
          title: 'Adjust approach based on feedback and results',
          resources: [
            { label: 'Using the Evaluation Tool', url: 'https://platform.claude.com/docs/en/test-and-evaluate/eval-tool' },
            { label: 'Define your success criteria', url: 'https://platform.claude.com/docs/en/test-and-evaluate/define-success' },
            { label: 'Chain complex prompts for stronger performance', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/chain-prompts' },
          ],
        },
        {
          id: 'obj-7-3',
          title: 'Optimize workflows for efficiency and effectiveness',
          resources: [
            { label: 'Choosing the right Claude model', url: 'https://claude.com/resources/tutorials/choosing-the-right-claude-model' },
            { label: "Use connectors to extend Claude's capabilities", url: 'https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities' },
            { label: 'Chain complex prompts for stronger performance', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/chain-prompts' },
          ],
        },
      ],
    },
  ],
};
