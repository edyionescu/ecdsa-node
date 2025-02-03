import { formatDateTime } from './lib';

function History({ selectedAddress, transfers }) {
  transfers = transfers.filter((transfer) => {
    if (selectedAddress.length == 0) {
      return transfer;
    }
    return [transfer.sender, transfer.recipient].includes(selectedAddress);
  });

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="px-4 py-5 sm:p-6">
        <h1 className="text-base font-semibold leading-6 text-gray-900 uppercase">History</h1>

        {transfers.length === 0 ? (
          <div className="text-sm mt-5">No data.</div>
        ) : (
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-5">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap px-2 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="whitespace-nowrap px-2 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Sender
                    </th>
                    <th className="whitespace-nowrap px-2 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Recipient
                    </th>
                    <th className="whitespace-nowrap px-2 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {transfers.map(({ time, sender, recipient, amount }) => (
                    <tr key={time}>
                      <td className="whitespace-nowrap px-2 py-2 text-center text-sm text-gray-500">
                        {formatDateTime(time)}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-center text-sm text-gray-900">
                        {sender}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-center text-sm text-gray-900">
                        {recipient}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-right pr-7 text-sm text-gray-900">
                        {amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
