import React from 'react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface FooterProps {
  copyright?: string;
  links?: FooterLink[];
  socials?: SocialLink[];
}

export function Footer({ copyright, links = [], socials = [] }: FooterProps) {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        {copyright && (
          <p className="text-sm text-muted-foreground">{copyright}</p>
        )}

        {links.length > 0 && (
          <nav className="flex gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {socials.length > 0 && (
          <div className="flex gap-3">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
