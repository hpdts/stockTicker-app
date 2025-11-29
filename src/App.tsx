import './App.css'
import { useEffect, useState } from "react";

import { TickerService } from './TickerService.ts';
import type { Company } from './TickerService.ts';

const tickerService = new TickerService();


function SearchStocks(stockName: string, setCompanies: any) {
  
  // Search for companies with "apple" in their name or symbol
  tickerService.search(stockName)
    .then(response => {
      // The response will have this structure:
      // {
      //   search: "apple",
      //   results: [
      //     { 
      //       symbol: "AAPL", 
      //       name: "Apple Inc.",
      //       lastPrice: 15000, // Price in cents
      //     },
      //     // Additional matching companies...
      //   ]
      // }
      console.log(response);
      //const data = response.json()
      setCompanies(response.results);
    })
    .catch(error => console.error(error));
}

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [watchedStocks, setWatchedStocks] = useState<Company[]>([]);

  useEffect(() => {
    // Register callback to update UI when watched stock prices change
    tickerService.onDataChanged((updatedStocks) => {
      setWatchedStocks(prevStocks => {
        // Only update prices of existing stocks, don't add/remove
        return prevStocks.map(stock => {
          const updated = updatedStocks.find(s => s.symbol === stock.symbol);
          return updated ? { ...stock, lastPrice: updated.lastPrice } : stock;
        }).filter(stock => prevStocks.find(s => s.symbol === stock.symbol));
      });
    });

    return () => {
      tickerService.unwatch();
    };
  }, []);

  console.log(companies);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim().length >= 2) {
      SearchStocks(value, setCompanies);
    } else {
      setCompanies([]);
    }
  };

  const addToWatchList = (company: Company) => {
    try {
      tickerService.watch(company.symbol);
      if (!watchedStocks.find(stock => stock.symbol === company.symbol)) {
        setWatchedStocks([...watchedStocks, company]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromWatchList = (symbol: string) => {
    tickerService.unwatch(symbol);
    setWatchedStocks(watchedStocks.filter(stock => stock.symbol !== symbol));
  }

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search stocks..."
        value={searchInput}
        onChange={handleSearch}
      />
      {companies.length > 0 && (
        <ul>
          {companies.map((company) => (
            <li key={company.symbol}>
              <span>{company.name} ({company.symbol})</span>
              <button onClick={() => addToWatchList(company)}>Add to WatchList</button>
            </li>
          ))}
        </ul>
      )}

            {watchedStocks.length > 0 && (
        <div>
          <h2>Watched Stocks</h2>
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {watchedStocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td>{stock.symbol}</td>
                  <td>{stock.name}</td>
                  <td>${(stock.lastPrice / 100).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeFromWatchList(stock.symbol)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
  );
}


export default App
