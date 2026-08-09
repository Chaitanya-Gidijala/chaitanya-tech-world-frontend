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
  questionCount: 60,
  color: '#D97706',
  accentColor: '#F59E0B',
  gradient: 'linear-gradient(135deg, #D97706, #F59E0B, #FCD34D)',
  description:
    'Master the fundamentals of working with Claude AI — from prompt engineering and output validation to governance and workflow integration. This certification validates your ability to effectively leverage Claude for real-world business and technical tasks.',
  domains: [
    {
      id: 'domain-2',
      number: 2,
      weight: 21,
      title: 'Output Evaluation and Validation',
      icon: '🔍',
      color: '#10B981',
      priority: 'high',
      description: 'The most heavily weighted domain. Focuses on critically assessing Claude’s responses, identifying hallucinations or biases, and determining when human verification is necessary.',
      topicsToLearn: ['Success Criteria', 'Evaluation Tools', 'Hallucination Reduction', 'Fact-checking', 'Output Refinement'],
      importantConcepts: [
        'Defining robust success criteria before evaluating outputs.',
        'Identifying different types of hallucinations and how to mitigate them.',
        'Understanding when a response requires mandatory human-in-the-loop review.',
        'Using JSON mode for consistent, parsable outputs.'
      ],
      practicalSkills: [
        'Build a simple evaluation rubric for a specific task.',
        'Prompt Claude to output in strict JSON format.',
        'Identify and correct a hallucination in a generated response.'
      ],
      learningOutcomes: [
        'Confidently evaluate Claude-generated outputs for accuracy and completeness.',
        'Systematically identify hallucinations, inconsistencies, and biases.',
        'Edit and refine outputs for specific audiences and formats.'
      ],
      commonMistakes: [
        'Blindly trusting Claude’s outputs without verifying facts.',
        'Failing to provide clear success criteria, making evaluation subjective.',
        'Over-relying on Claude for tasks requiring strict human oversight.'
      ],
      revisionPoints: [
        'Review the Evaluation Tool documentation.',
        'Memorize strategies for reducing hallucinations (e.g., asking Claude to quote sources).'
      ],
      questionTypes: [
        'Evaluating whether an AI output satisfies a given set of requirements.',
        'Identifying the most likely cause of a hallucination in a scenario.',
        'Choosing the best strategy to validate a specific type of output.'
      ],
      objectives: []
    },
    {
      id: 'domain-4',
      number: 4,
      weight: 16,
      title: 'Workflow Integration and Solution Design',
      icon: '⚙️',
      color: '#F59E0B',
      priority: 'high',
      description: 'Focuses on integrating Claude into existing business processes, analyzing requirements, and communicating its value to stakeholders.',
      topicsToLearn: ['Requirement Analysis', 'Process Optimization', 'Solution Design', 'Workflow Integration', 'Stakeholder Communication'],
      importantConcepts: [
        'Analyzing use cases to determine if Claude is the right tool.',
        'Integrating Claude with external tools (e.g., Google Workspace, GitHub).',
        'Designing workflows that augment human capabilities rather than fully replacing them.',
        'Communicating Claude\'s limitations clearly to stakeholders.'
      ],
      practicalSkills: [
        'Map out a business process and identify where Claude can add value.',
        'Use Claude with a connector (e.g., Google Drive) to analyze a document.',
        'Draft a short memo explaining Claude\'s benefits and limits for a specific project.'
      ],
      learningOutcomes: [
        'Apply Claude to analyze requirements and optimize processes.',
        'Support solution design and development using Claude.',
        'Effectively communicate Claude\'s value and limitations.'
      ],
      commonMistakes: [
        'Trying to fully automate processes that require human judgment.',
        'Failing to consider Claude\'s context limits when designing solutions.',
        'Overselling Claude\'s capabilities to stakeholders.'
      ],
      revisionPoints: [
        'Review the official guidance on using connectors and integrations.',
        'Understand the core principles of AI solution design.'
      ],
      questionTypes: [
        'Selecting the appropriate workflow design for a given business scenario.',
        'Identifying the best way to integrate Claude into an existing process.',
        'Choosing the most accurate way to explain Claude\'s limitations to a non-technical stakeholder.'
      ],
      objectives: []
    },
    {
      id: 'domain-6',
      number: 6,
      weight: 15,
      title: 'Governance, Risk, and Responsible Use',
      icon: '🛡️',
      color: '#EF4444',
      priority: 'high',
      description: 'Crucial domain covering Anthropic\'s Usage Policy, data privacy, regulatory considerations, and ethical AI usage.',
      topicsToLearn: ['Usage Policy', 'Data Privacy', 'Regulatory Compliance', 'Ethical AI', 'Claude\'s Constitution'],
      importantConcepts: [
        'Identifying use cases that violate Anthropic\'s Usage Policy.',
        'Understanding how data is used (and not used) for model training.',
        'Applying data sensitivity and privacy rules to prompt engineering.',
        'Understanding the principles behind Claude\'s Constitution.'
      ],
      practicalSkills: [
        'Review Anthropic\'s Usage Policy and identify prohibited use cases.',
        'Check your account\'s data privacy settings.',
        'Read Claude\'s Constitution to understand its foundational ethical guidelines.'
      ],
      learningOutcomes: [
        'Identify appropriate and inappropriate use cases according to official policies.',
        'Apply data sensitivity and privacy considerations to real-world scenarios.',
        'Understand the ethical implications of deploying AI.'
      ],
      commonMistakes: [
        'Assuming Claude can be used for any task (ignoring the Usage Policy).',
        'Inputting highly sensitive PII without understanding data privacy settings.',
        'Misunderstanding how Anthropic handles user data for model training.'
      ],
      revisionPoints: [
        'Memorize the key prohibitions in the Acceptable Use Policy.',
        'Understand Anthropic\'s stance on data privacy and model training.'
      ],
      questionTypes: [
        'Identifying a governance or privacy concern in a hypothetical scenario.',
        'Determining if a proposed use case violates the Acceptable Use Policy.',
        'Choosing the safest approach when handling sensitive data.'
      ],
      objectives: []
    },
    {
      id: 'domain-1',
      number: 1,
      weight: 14,
      title: 'Prompting and Task Execution',
      icon: '✍️',
      color: '#6366F1',
      priority: 'medium-high',
      description: 'The foundation of interacting with Claude. Covers prompt engineering best practices, multishot prompting, XML tags, and task decomposition.',
      topicsToLearn: ['Clear Prompting', 'Multishot Prompting', 'XML Tags', 'Task Decomposition', 'Prompt Iteration'],
      importantConcepts: [
        'Being clear, direct, and detailed in instructions.',
        'Using XML tags to structure complex prompts and separate instructions from data.',
        'Providing examples (multishot prompting) to guide Claude\'s output format.',
        'Breaking down complex tasks into smaller, manageable steps (task decomposition).'
      ],
      practicalSkills: [
        'Rewrite a vague prompt to be clear, direct, and detailed.',
        'Use XML tags to provide context and instructions separately.',
        'Create a prompt that includes two examples of the desired output.'
      ],
      learningOutcomes: [
        'Create effective prompts using official best practices.',
        'Apply task decomposition to structure complex requests.',
        'Iterate and adapt prompting strategies based on the task type.'
      ],
      commonMistakes: [
        'Writing overly complex, single-shot prompts instead of decomposing the task.',
        'Failing to use XML tags when providing large blocks of context.',
        'Assuming Claude implicitly understands formatting without examples.'
      ],
      revisionPoints: [
        'Review the official prompt engineering overview.',
        'Practice using XML tags and multishot prompting.'
      ],
      questionTypes: [
        'Identifying the best prompting approach for a specific goal.',
        'Determining how to improve a poorly constructed prompt.',
        'Selecting the most effective way to structure data within a prompt.'
      ],
      objectives: []
    },
    {
      id: 'domain-3',
      number: 3,
      weight: 12,
      title: 'Product and Model Selection',
      icon: '🎯',
      color: '#8B5CF6',
      priority: 'medium',
      description: 'Focuses on choosing the right tool for the job. Covers differences between Claude models (Haiku, Sonnet, Opus) and features like Projects and Artifacts.',
      topicsToLearn: ['Claude Models', 'Model Selection', 'Projects', 'Artifacts', 'Context Limitations'],
      importantConcepts: [
        'The differences in speed, cost, and intelligence between Haiku, Sonnet, and Opus.',
        'When to use Projects vs. standard chats.',
        'How Artifacts work and when they are generated.',
        'Understanding context windows and how to manage large amounts of information.'
      ],
      practicalSkills: [
        'Compare the pricing and speed of Haiku vs. Opus for a specific task.',
        'Create a Project and upload context documents.',
        'Prompt Claude to create an Artifact (e.g., a code snippet or document).'
      ],
      learningOutcomes: [
        'Differentiate between Claude model types and select the right one for a task.',
        'Select appropriate product features (Projects, Artifacts) based on needs.',
        'Understand and manage context limitations effectively.'
      ],
      commonMistakes: [
        'Always defaulting to Opus when Haiku or Sonnet would be more cost-effective and faster.',
        'Misunderstanding when Claude will generate an Artifact.',
        'Ignoring context window limits when uploading large documents.'
      ],
      revisionPoints: [
        'Memorize the core strengths of each model family.',
        'Understand the primary use cases for Projects and Artifacts.'
      ],
      questionTypes: [
        'Selecting an appropriate model based on constraints (cost, speed, quality).',
        'Choosing the right Claude feature (e.g., Projects) for a specific scenario.',
        'Identifying the best way to handle a large context requirement.'
      ],
      objectives: []
    },
    {
      id: 'domain-5',
      number: 5,
      weight: 12,
      title: 'Configuration and Knowledge Management',
      icon: '🗄️',
      color: '#06B6D4',
      priority: 'medium',
      description: 'Covers managing knowledge within Claude, configuring Projects with instructions, and maintaining uploaded sources.',
      topicsToLearn: ['Project Configuration', 'Knowledge Sources', 'System Instructions', 'Integrations'],
      importantConcepts: [
        'How to write effective system-level instructions for a Project.',
        'Managing and updating uploaded knowledge sources.',
        'Configuring connectors (e.g., Google Drive, GitHub) to access external knowledge.',
        'How Claude uses chat search and memory.'
      ],
      practicalSkills: [
        'Write custom instructions for a Claude Project.',
        'Upload and manage documents within a Project\'s knowledge base.',
        'Connect an external integration to a Claude workspace.'
      ],
      learningOutcomes: [
        'Configure Claude Projects with robust instructions and knowledge.',
        'Manage uploaded knowledge and integrations effectively.',
        'Create and maintain effective system-level instructions.'
      ],
      commonMistakes: [
        'Writing overly restrictive or conflicting system instructions.',
        'Failing to update outdated knowledge sources within a Project.',
        'Misunderstanding how connectors access external data.'
      ],
      revisionPoints: [
        'Review the documentation on creating and managing Projects.',
        'Understand best practices for writing system instructions.'
      ],
      questionTypes: [
        'Determining the best way to provide context to a Project.',
        'Identifying the cause of an issue related to outdated knowledge sources.',
        'Selecting the appropriate integration for a specific knowledge management need.'
      ],
      objectives: []
    },
    {
      id: 'domain-7',
      number: 7,
      weight: 10,
      title: 'Troubleshooting and Optimization',
      icon: '🔧',
      color: '#EC4899',
      priority: 'lower',
      description: 'Focuses on diagnosing issues with prompts or outputs and optimizing workflows for better performance.',
      topicsToLearn: ['Issue Diagnosis', 'Prompt Optimization', 'Workflow Refinement', 'Feedback Loops'],
      importantConcepts: [
        'Identifying the root cause of poor outputs (e.g., vague prompt, wrong model, insufficient context).',
        'Using the prompt improver and evaluation tools to optimize performance.',
        'Adjusting approaches based on empirical results.',
        'Optimizing workflows for speed and cost without sacrificing necessary quality.'
      ],
      practicalSkills: [
        'Diagnose why a specific prompt failed to produce the desired result.',
        'Use the prompt improver on an underperforming prompt.',
        'Identify a bottleneck in an AI workflow and suggest an optimization.'
      ],
      learningOutcomes: [
        'Identify, diagnose, and resolve issues with underperforming prompts.',
        'Adjust prompting approaches based on feedback and evaluation results.',
        'Optimize AI workflows for efficiency and effectiveness.'
      ],
      commonMistakes: [
        'Assuming the model is broken rather than diagnosing the prompt or context.',
        'Failing to iterate on prompts based on evaluation results.',
        'Optimizing for cost at the expense of necessary output quality.'
      ],
      revisionPoints: [
        'Review strategies for reducing hallucinations and improving consistency.',
        'Understand how to use evaluation tools for continuous improvement.'
      ],
      questionTypes: [
        'Choosing the best troubleshooting approach for a failing prompt.',
        'Identifying the most likely cause of a specific output error.',
        'Selecting the best way to optimize an existing workflow.'
      ],
      objectives: []
    }
  ],
};
