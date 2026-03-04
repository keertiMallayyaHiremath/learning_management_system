import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: bigint;
        email: string;
        name: string;
      };
    }
  }
}

export {};
