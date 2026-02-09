import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const APP_NAME = 'OhMyNextJS';
export const APP_DESCRIPTION = 'Next.js SaaS Boilerplate';
export const THEME_STORAGE_KEY = 'ohmynextjs-theme';
export const MIN_PASSWORD_LENGTH = 6;
