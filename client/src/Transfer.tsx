import type { Transfer as TransferType } from '@ecdsa-node/schema';
import { ArrowRightCircleIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { sign } from './lib';

function Transfer({
  sender,
  balance,
  setBalance,
  transfers,
  setTransfers,
}: {
  sender: string;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  transfers: TransferType[];
  setTransfers: React.Dispatch<React.SetStateAction<TransferType[]>>;
}) {
  const [nonce, setNonce] = useState(() => Date.now()); // used to protect against transaction replay

  useEffect(
    function resetForm() {
      document.querySelector('form')!.reset();
    },
    [sender]
  );

  async function transfer(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    try {
      const formData = new FormData(ev.target as HTMLFormElement);
      const amount = parseInt(formData.get('amount')?.toString() ?? '0');
      const recipient = formData.get('recipient')?.toString() ?? '';

      const message = {
        amount,
        recipient,
        nonce,
      };
      const { signatureHex, bit } = sign(sender, JSON.stringify(message));

      const server = import.meta.env.VITE_SERVER_BASE_URL;
      const response = await fetch(`${server}/send`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          signatureHex,
          bit,
        }),
      });

      const { balance } = await response.json();

      setBalance(balance);
      setNonce(Date.now());
      setTransfers([
        {
          time: Date.now(),
          sender,
          recipient,
          amount,
        },
        ...transfers,
      ]);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  const hasBalance = balance > 0;

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={transfer}>
          <h1 className="text-base font-semibold leading-6 text-gray-900 uppercase">Transfer</h1>

          <div className="isolate mb-5 mt-5 -space-y-px rounded-md shadow-xs">
            <div className="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-gray-600">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-900">
                Amount
              </label>
              <input
                name="amount"
                id="amount"
                required
                type="number"
                min={hasBalance ? 1 : 0}
                max={hasBalance ? balance : 0}
                placeholder={hasBalance ? `Max. ${balance}` : '0'}
                disabled={!hasBalance}
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="rounded-md relative rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-gray-600">
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-900">
                Recipient
              </label>
              <input
                name="recipient"
                id="recipient"
                required
                type="text"
                placeholder={hasBalance ? 'Type an address' : '...'}
                disabled={!hasBalance}
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="flow-root">
            <button
              type="submit"
              disabled={!hasBalance}
              className="inline-flex w-full items-center justify-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold tracking-wider text-white shadow-xs bg-gray-900 hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Send
              <ArrowRightCircleIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Transfer;
