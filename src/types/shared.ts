import { HttpStatus } from '@nestjs/common';

export const RetMsg = {
  OK: 'ok',
  UNKNOWN_ERR: 'unknown error',
  NOT_EXISTS_DATA: 'not exists data',
  WRONG_PW: 'wrong user password',
};

type GenericObject = { [key: string]: any };

export class ResponseJson {
  constructor(result?: GenericObject, message?: string, statusCode?: number) {
    this.statusCode = statusCode || HttpStatus.OK;
    this.message = message || RetMsg.OK;
    this.result = result;
  }

  statusCode!: number;
  message!: string;
  result!: GenericObject;
}

export class REMOVED {
  static readonly KEEP = 0;
  static readonly REMOVE = 1;
  static readonly HOLD = 2;
}
