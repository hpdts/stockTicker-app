import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import { TickerService } from '../src/TickerService';

vi.mock('./TickerService');

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Search stocks...')).toBeInTheDocument();
  });

  it('displays companies after search', async () => {
    const mockResponse = {
      results: [
        { symbol: 'AAPL', name: 'Apple Inc.', lastPrice: 15000 },
        { symbol: 'APPL', name: 'Apple Hospitality REIT Inc.', lastPrice: 1200 },
      ],
    };

    vi.mocked(TickerService).prototype.search.mockResolvedValue(mockResponse);

    render(<App />);
    const input = screen.getByPlaceholderText('Search stocks...');
    
    fireEvent.change(input, { target: { value: 'apple' } });

    await waitFor(() => {
      expect(screen.getByText('Apple Inc. (AAPL)')).toBeInTheDocument();
      expect(screen.getByText('Apple Hospitality REIT Inc. (APPL)')).toBeInTheDocument();
    });
  });

  it('does not display list when no companies found', () => {
    render(<App />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});