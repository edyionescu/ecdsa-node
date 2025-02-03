import { ACCOUNTS } from './lib';

function Wallet({ setSender, balance, setBalance }) {
  async function change(ev) {
    const sender = ev.target.value;
    setSender(sender);

    if (sender) {
      try {
        const server = import.meta.env.VITE_SERVER_BASE_URL;
        const response = await fetch(`${server}/balance/${sender}`);
        const { balance } = await response.json();
        setBalance(balance);
      } catch ({ message }) {
        console.error(message);
      }
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm relative">
      <div className="px-4 py-5 sm:p-6 ">
        <h1 className="text-base font-semibold leading-6 text-gray-900 uppercase">Wallet</h1>

        <div className="mt-9 mb-5">
          <label htmlFor="accounts" className="block text-sm font-medium leading-6 text-gray-900">
            Accounts
          </label>
          <select
            id="accounts"
            onChange={change}
            defaultValue="Canada"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-gray-600 sm:text-sm sm:leading-6"
          >
            <option value="">...</option>
            {Object.entries(ACCOUNTS).map(([address, { label }]) => (
              <option key={address} value={address}>
                {label}: {address}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lg:absolute bottom-0 w-full bg-gray-50 px-4 py-4 sm:px-6 text-center text-sm tracking-wider font-semibold">
        Balance: {balance}
      </div>
    </div>
  );
}

export default Wallet;
