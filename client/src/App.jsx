import { useState, useEffect } from 'react';

import Wallet from './Wallet';
import Transfer from './Transfer';
import History from './History';

function App() {
  const [balance, setBalance] = useState(0);
  const [sender, setSender] = useState('');
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    async function fetchTransfers() {
      try {
        const server = import.meta.env.VITE_SERVER_BASE_URL;
        const response = await fetch(`${server}/transfers`);
        const { transfers } = await response.json();
        setTransfers(transfers);
      } catch ({ message }) {
        console.error(message);
      }
    }
    fetchTransfers();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Wallet balance={balance} setBalance={setBalance} setSender={setSender} />

        <Transfer
          sender={sender}
          balance={balance}
          setBalance={setBalance}
          transfers={transfers}
          setTransfers={setTransfers}
        />

        <div className="lg:col-span-2">
          <History selectedAddress={sender} transfers={transfers} />
        </div>
      </div>
    </div>
  );
}

export default App;
