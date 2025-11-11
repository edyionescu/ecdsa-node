import type { Transfer as TransferType } from '@ecdsa-node/schema';
import { useEffect, useState } from 'react';

import History from './History';
import ThemeToggle from './ThemeToggle';
import Transfer from './Transfer';
import Wallet from './Wallet';

function App() {
  const [balance, setBalance] = useState(0);
  const [sender, setSender] = useState('');
  const [transfers, setTransfers] = useState<TransferType[]>([]);

  useEffect(function fetchTransfers() {
    (async () => {
      try {
        const server = import.meta.env.VITE_SERVER_BASE_URL;
        const response = await fetch(`${server}/transfers`);
        const { transfers } = await response.json();
        setTransfers(transfers);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    })();
  }, []);

  return (
    <>
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
      <div className="absolute right-5 top-5 z-1">
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}

export default App;
