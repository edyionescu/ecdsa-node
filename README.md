# ECDSA node

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/edyionescu/ecdsa-node)
![GitHub License](https://img.shields.io/github/license/edyionescu/ecdsa-node)

React frontend that communicates with a Node.js server responsible for transferring balances between addresses by creating digital signatures with the appropriate private keys and verifying them on the backend.

It uses the [Ethereum Cryptography library](https://github.com/ethereum/js-ethereum-cryptography), specifically the [elliptic curve operations](https://github.com/paulmillr/noble-curves) on the curve secp256k1.

![demo](ecdsa-node.png)

## Prerequisites

- [Node.js](https://nodejs.org/) version 20+
- [pnpm](https://pnpm.io/) version 10+

## Usage

#### Client ([React](https://react.dev/), [Vite](https://vite.dev/), [Tailwind CSS](https://tailwindcss.com/))

1. Open the `/client` folder from terminal.
2. `cat .env.example > .env`
3. Run `pnpm install` to install all the dependencies.
4. Run `pnpm dev` to start the application[^1].
5. Visit the application at http://127.0.0.1:5173/.

#### Server ([Express](https://expressjs.com/))

1. Open the `/server` folder from terminal.
2. `cat .env.example > .env`
3. Run `pnpm install` to install all the dependencies.
4. Get private key/address pairs by running `pnpm generate` and copy them into `accounts.config.json` using the JSON structure below:

   ```
   {
     "address_1": {
       "label": "Account 1",
       "balance": 10,
       "privateKey": "privateKey_1"
     },
     "address_2": {
       "label": "Account 2",
       "balance": 20,
       "privateKey": "privateKey_2"
     }
   }
   ```

5. Run `pnpm dev` to start the server[^1].

[^1]: Alternatively, you can run both the client and server in parallel. Either use `pnpm dev` in the root directory, or run the task included in `.vscode/tasks.json` with `Ctrl+Shift+P` / `Cmd+Shift+P` > `Tasks: Run Task` > `Start: Client & Server`.
