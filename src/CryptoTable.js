import React, { useState, useEffect } from 'react';
import './CryptoTable.css';

const CryptoTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  // Fetch data using .then
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Fetch data using async/await
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search function
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Sort function
  const handleSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Filter data based on search term
  const filteredData = sortedData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div>
    <div className="container">
      <div className="search-sort-container">
        <input
          type="text"
          placeholder="Search by name"
          onChange={handleSearch}
        />
        <button onClick={() => handleSort('market_cap')}>
          Sort by Market Cap
        </button>
        <button onClick={() => handleSort('price_change_percentage_24h')}>
        Sort by percentage
        </button>
      </div>
      <table>
        {/* <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Current Price</th>
            <th>Total Volume</th>
            <th>% Change (24h)</th>
          </tr>
        </thead> */}
        <tbody>
          {filteredData.map((coin) => (
            <tr key={coin.id}>
              <td>
                <img src={coin.image} alt={coin.name} />
              </td>
              <td>{coin.name}</td>
              <td>{coin.symbol}</td>
              <td>${coin.current_price.toFixed(2)}</td>
              <td>${coin.total_volume.toLocaleString()}</td>
              <td
                style={{
                  color:
                    coin.price_change_percentage_24h > 0 ? 'green' : 'red',
                }}
              >
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </td>
              
            </tr>
            
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default CryptoTable;
