import { ApiProperty } from '@nestjs/swagger';
import type { ApiError } from '@shared/responses/api-error.interface';

export class ApiErrorDto implements ApiError {
  @ApiProperty({
    example: 'VALIDATION_ERROR',
    description: 'Functional or technical error code.',
  })
  code!: string;

  @ApiProperty({
    example: 'Email is required.',
    description: 'Human-readable error detail.',
  })
  message!: string;
}
