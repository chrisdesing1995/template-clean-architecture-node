import { PartialType } from '@nestjs/swagger';
import { CreatePersonDto } from '@application/persons/dtos/create-person.dto';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {}
