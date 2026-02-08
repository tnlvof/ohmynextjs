import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { CTA } from '@/components/landing/cta';

describe('Landing Page Components', () => {
  describe('Hero', () => {
    it('renders title and subtitle', () => {
      render(<Hero />);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/빠르게 시작/);
    });

    it('renders CTA button', () => {
      render(<Hero />);
      expect(screen.getByRole('link', { name: /시작하기/i })).toBeInTheDocument();
    });
  });

  describe('Features', () => {
    it('renders feature cards', () => {
      render(<Features />);
      const headings = screen.getAllByRole('heading', { level: 3 });
      const titles = headings.map(h => h.textContent);
      expect(titles).toContain('인증');
      expect(titles).toContain('결제');
      expect(titles).toContain('관리자');
    });
  });

  describe('CTA', () => {
    it('renders CTA section with link', () => {
      render(<CTA />);
      expect(screen.getByRole('link', { name: /무료로 시작/i })).toBeInTheDocument();
    });
  });
});
