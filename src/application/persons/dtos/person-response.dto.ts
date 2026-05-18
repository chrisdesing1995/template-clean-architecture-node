import { ApiProperty } from '@nestjs/swagger';

export class PersonResponseDto {
  @ApiProperty({
    example: 'bcc038a8-58a8-4220-b7ea-6021f0403df8',
  })
  id!: string;

  @ApiProperty({
    example: 'Ada',
  })
  firstName!: string;

  @ApiProperty({
    example: 'Lovelace',
  })
  lastName!: string;

  @ApiProperty({
    example: 'ada.lovelace@example.com',
  })
  email!: string;

  @ApiProperty({
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    example: '2026-05-17T12:00:00.000Z',
  })
  createdAt!: Date;
}
