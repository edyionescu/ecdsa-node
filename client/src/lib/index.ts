import type { Accounts } from '@ecdsa-node/schema';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { utf8ToBytes } from 'ethereum-cryptography/utils.js';

import ACCOUNTS from '../../../accounts.config.json';

const accounts: Accounts = ACCOUNTS;

function sign(address: string, message: string) {
  const account = accounts[address];
  const { privateKey } = account;
  const messageHash = _hashMessage(message);

  const signature = secp256k1.sign(messageHash, privateKey);
  const bit = signature.recovery;
  const signatureHex = signature.toCompactHex();

  return { signatureHex, bit };
}

function _hashMessage(message: string) {
  return keccak256(utf8ToBytes(message));
}

function formatDateTime(timestamp: number) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    hour12: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // current timezone
  });

  return formatter.format(new Date(timestamp));
}

export { accounts, formatDateTime, sign };
