import { config } from '@dotenvx/dotenvx';
config();

import type {
  Accounts,
  Balances,
  SendErrorResponse,
  SendSuccessResponse,
  Transfer,
} from '@ecdsa-node/schema';
import { SendRequestBodySchema } from '@ecdsa-node/schema';
import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';
import { getAddress, getPublicKeyFromSignature } from './lib/index.ts';

const ACCOUNTS: Accounts = await import('../accounts.config.json', {
  with: { type: 'json' },
}).then((module) => module.default);

const balances: Balances = {};
const initialDeposits: Transfer[] = [];

Object.entries(ACCOUNTS).forEach(([address, { balance }], idx) => {
  balances[address] = balance; // { 'address1': 1, 'address2': 2, 'address3': 3 };
  initialDeposits.push({
    time: Date.now() + idx,
    sender: '0x0',
    recipient: address,
    amount: balance,
  });
});

let transfers = [...initialDeposits];
let serverNonce = 0; // used to protect against transaction replay

const app = express();
app.use(cors());
app.use(express.json());

app.get('/transfers', (req: Request, res: Response) => {
  res.send({ transfers });
});

app.get('/balance/:address', (req: Request<{ address: string }>, res: Response) => {
  const { address } = req.params;
  const balance = balances[address] ?? 0;
  res.send({ balance });
});

app.post('/send', (req: Request, res: Response) => {
  const result = SendRequestBodySchema.safeParse(req.body);

  if (!result.success) {
    const errorResponse: SendErrorResponse = {
      success: false,
      message: `Invalid request body: ${result.error.issues.map((issue) => issue.message).join(', ')}`,
    };
    res.status(400).send(errorResponse);
    return;
  }

  const { message, signatureHex, bit } = result.data;
  const { recipient, amount, nonce: clientNonce } = message;
  const { publicKey, isValidSig } = getPublicKeyFromSignature(JSON.stringify(message), signatureHex, bit);

  if (!isValidSig) {
    const errorResponse: SendErrorResponse = { success: false, message: 'Invalid signature' };
    res.status(400).send(errorResponse);
  } else if (serverNonce >= clientNonce) {
    const errorResponse: SendErrorResponse = { success: false, message: 'Invalid nonce' };
    res.status(400).send(errorResponse);
  } else {
    const sender = getAddress(publicKey);

    if (!sender) {
      const errorResponse: SendErrorResponse = { success: false, message: 'Could not derive sender address' };
      res.status(400).send(errorResponse);
    } else if (balances[sender] === undefined) {
      const errorResponse: SendErrorResponse = { success: false, message: 'Invalid account' };
      res.status(400).send(errorResponse);
    } else if (balances[sender] < amount) {
      const errorResponse: SendErrorResponse = { success: false, message: 'Not enough funds' };
      res.status(400).send(errorResponse);
    } else {
      serverNonce = clientNonce;

      transfers = [
        {
          time: Date.now(),
          sender,
          recipient,
          amount,
        },
        ...transfers,
      ];

      balances[recipient] ??= 0;
      balances[recipient] += amount;
      balances[sender] -= amount;

      const successResponse: SendSuccessResponse = { success: true, balance: balances[sender] };
      res.send(successResponse);
    }
  }
});

const { PORT = 4000 } = process.env;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
