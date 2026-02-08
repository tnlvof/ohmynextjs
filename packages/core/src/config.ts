export interface OhMyConfig {
  app: {
    name: string;
    description?: string;
    url?: string;
  };
  theme?: {
    defaultTheme?: 'light' | 'dark' | 'system';
    storageKey?: string;
  };
  layout?: {
    header?: boolean;
    footer?: boolean;
    sidebar?: boolean;
  };
}

export const defaultConfig: OhMyConfig = {
  app: {
    name: 'OhMyNextJS',
    description: 'Next.js SaaS Boilerplate',
  },
  theme: {
    defaultTheme: 'system',
    storageKey: 'ohmynextjs-theme',
  },
  layout: {
    header: true,
    footer: true,
    sidebar: false,
  },
};
