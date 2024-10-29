import { config } from '@dotenvx/dotenvx';
config();

import express from 'express';
import cors from 'cors';
import { getPublicKeyFromSignature, getAddress } from './lib/index.js';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ACCOUNTS = require('../accounts.config.json');

const balances = {};
const initialDeposits = [];

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

app.get('/transfers', (req, res) => {
  res.send({ transfers });
});

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] ?? 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { message, signatureHex, bit } = req.body;
  const { recipient, amount, nonce: clientNonce } = message;
  const { publicKey, isValidSig } = getPublicKeyFromSignature(JSON.stringify(message), signatureHex, bit);

  if (!isValidSig) {
    res.status(400).send({ message: 'Invalid signature' });
  } else if (serverNonce >= clientNonce) {
    res.status(400).send({ message: 'Invalid nonce' });
  } else {
    const sender = getAddress(publicKey);

    if (balances[sender] === undefined) {
      res.status(400).send({ message: 'Invalid account' });
    } else if (balances[sender] < amount) {
      res.status(400).send({ message: 'Not enough funds' });
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

      res.send({ balance: balances[sender] });
    }
  }
});

const { PORT } = process.env;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
