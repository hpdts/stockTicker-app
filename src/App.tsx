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
  /*
  useEffect(()=>{
    SearchStocks("apple", setCompanies);
  },[]);*/
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
              {company.name} ({company.symbol})
            </li>
          ))}
        </ul>
      )}
      </div>
  );
}


export default App
