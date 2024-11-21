import { Request } from "express";

declare global {
  declare namespace Express {
    interface Request {
      headers: {
        language?: T_ValidLanguages;
      };
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      language: T_Language;
    }
  }
}

export interface CustomRequest extends Request {
  userId?: string;
}

declare module "bodyParser";
