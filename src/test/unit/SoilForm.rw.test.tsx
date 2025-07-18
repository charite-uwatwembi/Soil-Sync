import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, it } from 'vitest';
import SoilForm from '../../components/SoilForm';
import { LanguageProvider } from '../../contexts/LanguageContext';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('SoilForm Kinyarwanda labels', () => {
  beforeEach(() => {
    localStorage.setItem('soil-sync-language', 'rw');
  });

  afterEach(() => {
    localStorage.removeItem('soil-sync-language');
  });

  it('shows Kinyarwanda field labels when language is set to rw', () => {
    render(
      <Wrapper>
        <SoilForm isDarkMode={false} loading={false} onSubmit={() => {}} />
      </Wrapper>
    );

    // The Kinyarwanda translation for Temperature is "Ubushyuhe"
    screen.getByLabelText(/Ubushyuhe/i);
  });
}); 