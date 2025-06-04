import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PaginationTokenPipe implements PipeTransform {
  transform(value: string | undefined) {
    if (!value) return undefined;

    let decoded: string;
    try {
      decoded = Buffer.from(value, 'base64').toString('utf-8');
    } catch {
      throw new BadRequestException('Invalid pagination token encoding');
    }

    try {
      const parsed = JSON.parse(decoded);
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error();
      }
      return parsed;
    } catch {
      throw new BadRequestException('Invalid pagination token format');
    }
  }
}
