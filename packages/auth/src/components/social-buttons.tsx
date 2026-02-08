'use client';

import React, { useState } from 'react';
import type { OAuthProvider } from '../types';

interface SocialButtonsProps {
  providers?: OAuthProvider[];
  size?: 'sm' | 'default' | 'lg';
  onProviderClick?: (provider: OAuthProvider) => Promise<void>;
}

const PROVIDER_CONFIG: Record<OAuthProvider, { label: string; color: string }> = {
  google: { label: 'Google', color: '#4285F4' },
  kakao: { label: 'Kakao', color: '#FEE500' },
  naver: { label: 'Naver', color: '#03C75A' },
  github: { label: 'GitHub', color: '#333' },
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
    <div data-testid="social-buttons">
      {providers.map((provider) => (
        <button
          key={provider}
          onClick={() => handleClick(provider)}
          disabled={loadingProvider !== null}
          data-testid={`social-${provider}`}
          style={{ backgroundColor: PROVIDER_CONFIG[provider].color }}
          aria-label={`${PROVIDER_CONFIG[provider].label}로 로그인`}
        >
          {loadingProvider === provider
            ? '로딩 중...'
            : `${PROVIDER_CONFIG[provider].label}로 로그인`}
        </button>
      ))}
    </div>
  );
}
