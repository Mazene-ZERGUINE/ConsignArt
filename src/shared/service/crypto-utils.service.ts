import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { PASSPHRASE_WORDS } from '../constants/passphrase-words';

@Injectable()
export class CryptoUtilsService {
  private readonly DEFAULT_SALT_ROUNDS = 10;

  constructor(private configService: ConfigService) {}

  public async hashPasswordWithBcrypt(plainText: string): Promise<string> {
    const saltRounds = this.configService.get<number>('SALT_ROUNDS', this.DEFAULT_SALT_ROUNDS);
    return await bcrypt.hash(plainText, saltRounds);
  }

  public async validatePassword(plainText: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedPassword);
  }

  public generatePassphrase(wordCount = 5): string {
    return Array.from({ length: wordCount }, () => {
      const word = PASSPHRASE_WORDS[randomInt(PASSPHRASE_WORDS.length)];
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('-');
  }
}
