import { BadRequestException } from '@nestjs/common';
import { FrenchDatePipe } from '../../../src/core/pipes/french-date.pipe';

describe('FrenchDatePipe', () => {
  const pipe = new FrenchDatePipe();

  it('returns undefined when the value is absent (optional query param)', () => {
    expect(pipe.transform(undefined)).toBeUndefined();
    expect(pipe.transform('')).toBeUndefined();
  });

  it('parses a valid DD/MM/YYYY date into a UTC Date', () => {
    const result = pipe.transform('01/03/2026');

    expect(result).toBeInstanceOf(Date);
    expect(result?.getUTCFullYear()).toBe(2026);
    expect(result?.getUTCMonth()).toBe(2); // 0-indexed: March
    expect(result?.getUTCDate()).toBe(1);
  });

  it('throws BadRequestException for a value that is not in DD/MM/YYYY shape', () => {
    expect(() => pipe.transform('2026-03-01')).toThrow(BadRequestException);
    expect(() => pipe.transform('1/3/2026')).toThrow(BadRequestException);
    expect(() => pipe.transform('not-a-date')).toThrow(BadRequestException);
  });

  it('throws BadRequestException for a calendar date that does not exist', () => {
    expect(() => pipe.transform('31/02/2026')).toThrow(BadRequestException);
    expect(() => pipe.transform('31/02/2026')).toThrow('this calendar date does not exist');
  });
});
