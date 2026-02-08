export interface AgentsMdConfig {
  projectName: string;
  description: string;
  techStack: string[];
  packages: string[];
  language: 'ko' | 'en';
  codeStyle: {
    semicolons: boolean;
    quotes: 'single' | 'double';
    indentSize: number;
  };
  customInstructions?: string;
}

export interface SubagentPreset {
  name: string;
  description: string;
  prompt: string;
}
