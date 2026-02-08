import '@testing-library/jest-dom';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Mock @ohmynextjs/core
vi.mock('@ohmynextjs/core', () => ({
  OhMyProvider: ({ children }: any) => <div data-testid="ohmy-provider">{children}</div>,
  Header: ({ logo, navItems }: any) => (
    <header data-testid="header">
      {logo && <span>{logo}</span>}
      {navItems?.map((item: any) => <a key={item.href} href={item.href}>{item.label}</a>)}
    </header>
  ),
  Footer: ({ links }: any) => <footer data-testid="footer">Footer</footer>,
  Sidebar: ({ items }: any) => (
    <aside data-testid="sidebar">
      {items?.map((item: any) => <a key={item.href} href={item.href}>{item.label}</a>)}
    </aside>
  ),
  MobileNav: () => <div data-testid="mobile-nav" />,
  ThemeProvider: ({ children }: any) => <div>{children}</div>,
  ThemeToggle: () => <button data-testid="theme-toggle">Theme</button>,
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

// Mock @ohmynextjs/auth
vi.mock('@ohmynextjs/auth', () => ({
  AuthForm: ({ mode }: any) => <div data-testid={`auth-form-${mode}`} />,
  SocialButtons: () => <div data-testid="social-buttons" />,
  UserButton: () => <button data-testid="user-button" />,
  AuthGuard: ({ children }: any) => <div data-testid="auth-guard">{children}</div>,
  useUser: () => ({ user: null, loading: false }),
  useSession: () => ({ session: null, loading: false }),
  authMiddleware: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
}));
