import { Injectable } from '@nestjs/common';
import { hash, verify, argon2id } from 'argon2';

@Injectable()
export class PasswordService {
  async hash(value: string): Promise<string> {
    return hash(value, {
      type: argon2id
    });
  }

  async verify(hashValue: string, plain: string): Promise<boolean> {
    if (!hashValue) {
      return false;
    }
    try {
      return await verify(hashValue, plain);
    } catch {
      return false;
    }
  }
}
