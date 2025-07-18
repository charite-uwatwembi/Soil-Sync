import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SoilForm from '../../components/SoilForm';
import { LanguageProvider } from '../../contexts/LanguageContext';

// Helper to render the component with required providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
};

describe('SoilForm Component', () => {
  it('renders with default values and submits user input', () => {
    const handleSubmit = vi.fn();

    renderWithProviders(
      <SoilForm isDarkMode={false} loading={false} onSubmit={handleSubmit} />
    );

    // Update some input fields
    fireEvent.change(screen.getByLabelText(/Temperature/i), {
      target: { value: '30' }
    });
    fireEvent.change(screen.getByLabelText(/Humidity/i), {
      target: { value: '50' }
    });
    fireEvent.change(screen.getByLabelText(/Nitrogen/i), {
      target: { value: '40' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Get Fertilizer Recommendation/i }));

    // Ensure callback is called once with the correct data
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    const submittedData = handleSubmit.mock.calls[0][0];
    expect(submittedData.Temparature).toBe(30);
    expect(submittedData.Nitrogen).toBe(40);
  });
}); 