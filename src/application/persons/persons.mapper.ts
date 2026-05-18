import type { Person } from '@domain/persons/person.entity';
import type { PersonResponseDto } from '@application/persons/dtos/person-response.dto';

export class PersonsMapper {
  static toResponse(person: Person): PersonResponseDto {
    return {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      isActive: person.isActive,
      createdAt: person.createdAt,
    };
  }
}
