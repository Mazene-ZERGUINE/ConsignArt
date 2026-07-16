import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { CODE_ALPHABET, DEFAULT_SALT_ROUNDS } from '../constants/crypto.constants';

@Injectable()
export class CryptoUtilsService {
  constructor(private configService: ConfigService) {}

  public async hashPasswordWithBcrypt(plainText: string): Promise<string> {
    const saltRounds = this.configService.get<number>('SALT_ROUNDS', DEFAULT_SALT_ROUNDS);
    return await bcrypt.hash(plainText, saltRounds);
  }

  public async validatePassword(plainText: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedPassword);
  }

  public generateCode(length = 20, groupSize = 5): string {
    const chars = Array.from({ length }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]);

    if (groupSize <= 0) return chars.join('');

    const groups: string[] = [];
    for (let i = 0; i < chars.length; i += groupSize) {
      groups.push(chars.slice(i, i + groupSize).join(''));
    }
    return groups.join('-');
  }
}
