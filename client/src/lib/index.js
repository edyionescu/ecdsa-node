import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { utf8ToBytes } from 'ethereum-cryptography/utils.js';

import ACCOUNTS from '../../../accounts.config.json';

function sign(address, message) {
  const { privateKey } = ACCOUNTS[address];
  const messageHash = _hashMessage(message);

  const signature = secp256k1.sign(messageHash, privateKey);
  const bit = signature.recovery;
  const signatureHex = signature.toCompactHex();

  return { signatureHex, bit };
}

function _hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

function formatDateTime(timestamp) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    hour12: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // current timezone
  });

  return formatter.format(new Date(timestamp));
}

export { ACCOUNTS, sign, formatDateTime };
