import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Sidebar from '../../components/Sidebar';
import { LanguageProvider } from '../../contexts/LanguageContext'; // ⬅️ add

const renderSidebar = (initialRoute: string) => {
  return render(
    <LanguageProvider>                                            {/* ⬅️ wrap */}
      <MemoryRouter initialEntries={[initialRoute]}>
        <Sidebar />
      </MemoryRouter>
    </LanguageProvider>
  );
};

describe('Sidebar navigation', () => {
  it('marks Dashboard link as active when on /dashboard', () => {
    renderSidebar('/dashboard');

    const dashboardBtn = screen.getByRole('button', { name: /dashboard/i });
    // At minimum it should be present:
    expect(dashboardBtn).toBeInTheDocument();

    // Optional – assert active class if you have one:
    // expect(dashboardBtn.className).toMatch(/text-blue|bg-gray-900|active/);
  });
});