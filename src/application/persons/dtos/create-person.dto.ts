import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePersonDto {
  @ApiProperty({
    example: 'Ada',
    description: 'Person first name.',
  })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({
    example: 'Lovelace',
    description: 'Person last name.',
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    example: 'ada.lovelace@example.com',
    description: 'Person email address.',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
