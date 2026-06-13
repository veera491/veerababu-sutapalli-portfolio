import 'server-only';
import { parseCsv } from './csv/parser';

export interface ThemeTokens {
  background: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
}

export async function getThemeTokens(): Promise<ThemeTokens> {
  const { content } = await parseCsv();
  const themeItem = content['theme']?.find(i => i.itemId === 'global');
  
  if (!themeItem) {
    return {
      background: '#0d0d0d',
      surface: '#171717',
      text: '#f5f5f5',
      muted: '#a3a3a3',
      accent: '#ff6b35'
    };
  }

  return {
    background: (themeItem.fields['background'] as string) || '#0d0d0d',
    surface: (themeItem.fields['surface'] as string) || '#171717',
    text: (themeItem.fields['text'] as string) || '#f5f5f5',
    muted: (themeItem.fields['muted'] as string) || '#a3a3a3',
    accent: (themeItem.fields['accent'] as string) || '#ff6b35'
  };
}

export function generateThemeVariables(tokens: ThemeTokens): React.CSSProperties {
  return {
    '--color-background': tokens.background,
    '--color-surface': tokens.surface,
    '--color-text': tokens.text,
    '--color-muted': tokens.muted,
    '--color-accent': tokens.accent,
    '--color-border': 'color-mix(in srgb, var(--color-text) 12%, transparent)',
    '--color-border-strong': 'color-mix(in srgb, var(--color-text) 24%, transparent)',
    '--color-accent-soft': 'color-mix(in srgb, var(--color-accent) 15%, transparent)',
    '--color-accent-contrast': '#ffffff',
    '--color-focus-ring': 'color-mix(in srgb, var(--color-accent) 60%, transparent)',
  } as React.CSSProperties;
}
