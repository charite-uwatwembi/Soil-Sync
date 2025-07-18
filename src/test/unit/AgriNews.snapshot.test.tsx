import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AgriNews from '../../components/AgriNews';
import { LanguageProvider } from '../../contexts/LanguageContext';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('AgriNews snapshot', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <Wrapper>
        <AgriNews />
      </Wrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });
}); 