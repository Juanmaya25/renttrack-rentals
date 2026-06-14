import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App.jsx';

afterEach(cleanup);

describe('RentTrack App', () => {
  it('renders the brand and the dashboard headline', () => {
    render(<App />);
    expect(screen.getByText('RentTrack')).toBeInTheDocument();
    expect(screen.getByText('Tu portafolio de hoy')).toBeInTheDocument();
  });

  it('navigates to Propiedades and lists seeded properties', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Propiedades/ }));
    expect(screen.getByText('Casa 45 - Laureles')).toBeInTheDocument();
    expect(screen.getByText('Bodega Industrial - Itagüí')).toBeInTheDocument();
  });

  it('filters properties by status (vacant)', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Propiedades/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Disponibles' }));
    expect(screen.getByText('Bodega Industrial - Itagüí')).toBeInTheDocument();
    expect(screen.queryByText('Apto 301 - Ed. Mirador')).not.toBeInTheDocument();
  });

  it('shows the payments table with collected total', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Pagos/ }));
    expect(screen.getByText('Cobrado este mes')).toBeInTheDocument();
    expect(screen.getAllByText('Marcar pagado').length).toBeGreaterThan(0);
  });

  it('toggles light/dark theme', () => {
    const { container } = render(<App />);
    const root = container.firstChild;
    const before = root.style.background;
    fireEvent.click(screen.getByRole('button', { name: 'Tema' }));
    expect(root.style.background).not.toBe(before);
  });
});
