import { z } from 'zod';

export interface Account {
  label: string;
  balance: number;
  privateKey: string;
}

export interface Accounts {
  [address: string]: Account;
}

export interface Transfer {
  time: number;
  sender: string;
  recipient: string;
  amount: number;
}

export interface Balances {
  [address: string]: number;
}

export interface Message {
  amount: number;
  recipient: string;
  nonce: number;
}

export interface SendSuccessResponse {
  success: true;
  balance: number;
}

export interface SendErrorResponse {
  success: false;
  message: string;
}

export type SendResponse = SendSuccessResponse | SendErrorResponse;

// zod schemas
export const MessageSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  recipient: z.string(),
  nonce: z.number(),
});

export const SendRequestBodySchema = z.object({
  message: MessageSchema,
  signatureHex: z.string(),
  bit: z.number().int().gte(0).lte(3), // recovery bit is typically 0-3
});

export type SendRequestBody = z.infer<typeof SendRequestBodySchema>;
