import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';

vi.mock('../src/TickerService', () => {
  return {
    TickerService: class {
      search = vi.fn().mockResolvedValue({
        results: [
          { symbol: 'AAPL', name: 'Apple Inc.', lastPrice: 15000 },
        ],
      });
      watch = vi.fn();
      unwatch = vi.fn();
      onDataChanged = vi.fn((callback) => callback([]));
    },
  };
});

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Search stocks...')).toBeInTheDocument();
  });

  it('displays companies after search', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Search stocks...');
    
    fireEvent.change(input, { target: { value: 'apple' } });

    await waitFor(() => {
      expect(screen.getByText('Apple Inc. (AAPL)')).toBeInTheDocument();
    });
  });

  it('does not display list when input is empty', () => {
    render(<App />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});