import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const FRENCH_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

@Injectable()
export class FrenchDatePipe implements PipeTransform<string | undefined, Date | undefined> {
  public transform(value?: string): Date | undefined {
    if (value === undefined || value === '') return undefined;

    const match = FRENCH_DATE_PATTERN.exec(value);
    if (!match) {
      throw new BadRequestException(
        `Invalid date "${value}": expected the French format DD/MM/YYYY`,
      );
    }

    const [, day, month, year] = match;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

    const isRealCalendarDate =
      date.getUTCFullYear() === Number(year) &&
      date.getUTCMonth() === Number(month) - 1 &&
      date.getUTCDate() === Number(day);

    if (!isRealCalendarDate) {
      throw new BadRequestException(`Invalid date "${value}": this calendar date does not exist`);
    }

    return date;
  }
}
