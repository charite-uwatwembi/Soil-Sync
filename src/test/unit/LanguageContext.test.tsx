import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('LanguageContext', () => {
  it('toggles between English and Kinyarwanda', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe('en');

    act(() => {
      result.current.toggleLanguage();
    });
    expect(result.current.language).toBe('rw');
  });
}); 