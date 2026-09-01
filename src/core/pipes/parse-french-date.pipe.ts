import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const FRENCH_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

/**
 * Business transformation pipe: accepts a date in French format (JJ/MM/AAAA)
 * and normalizes it to an ISO 8601 date string (YYYY-MM-DD) for internal use.
 */
@Injectable()
export class ParseFrenchDatePipe implements PipeTransform<string | undefined, string | undefined> {
  transform(value: string | undefined, metadata: ArgumentMetadata): string | undefined {
    if (value === undefined) return undefined;

    const fieldName = metadata.data ?? 'date';
    const match = FRENCH_DATE_PATTERN.exec(value);
    if (!match) {
      throw new BadRequestException(
        `${fieldName} must be a valid date in French format (JJ/MM/AAAA)`,
      );
    }

    const [, day, month, year] = match;
    const isoDate = `${year}-${month}-${day}`;
    const parsed = new Date(isoDate);
    const isValidCalendarDate =
      !Number.isNaN(parsed.getTime()) &&
      parsed.getUTCFullYear() === Number(year) &&
      parsed.getUTCMonth() === Number(month) - 1 &&
      parsed.getUTCDate() === Number(day);

    if (!isValidCalendarDate) {
      throw new BadRequestException(`${fieldName} is not a valid calendar date`);
    }

    return isoDate;
  }
}
