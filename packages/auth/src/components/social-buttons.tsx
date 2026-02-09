'use client';

import React, { useState } from 'react';
import type { OAuthProvider } from '../types';

interface SocialButtonsProps {
  providers?: OAuthProvider[];
  size?: 'sm' | 'default' | 'lg';
  onProviderClick?: (provider: OAuthProvider) => Promise<void>;
}

const PROVIDER_CONFIG: Record<OAuthProvider, { label: string; icon: string }> = {
  google: { label: 'Google', icon: 'G' },
  kakao: { label: 'Kakao', icon: 'K' },
  naver: { label: 'Naver', icon: 'N' },
  github: { label: 'GitHub', icon: 'GH' },
};

export function SocialButtons({
  providers = ['google', 'kakao', 'naver', 'github'],
  size = 'default',
  onProviderClick,
}: SocialButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);

  const handleClick = async (provider: OAuthProvider) => {
    setLoadingProvider(provider);
    try {
      await onProviderClick?.(provider);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div data-testid="social-buttons" className="grid grid-cols-2 gap-3">
      {providers.map((provider) => (
        <button
          key={provider}
          onClick={() => handleClick(provider)}
          disabled={loadingProvider !== null}
          data-testid={`social-${provider}`}
          aria-label={`${PROVIDER_CONFIG[provider].label}로 로그인`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="font-bold">{PROVIDER_CONFIG[provider].icon}</span>
          {loadingProvider === provider
            ? '로딩 중...'
            : PROVIDER_CONFIG[provider].label}
        </button>
      ))}
    </div>
  );
}
