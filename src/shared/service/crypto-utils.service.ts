import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

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
}
