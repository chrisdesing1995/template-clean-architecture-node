import { Module } from '@nestjs/common';
import { PersonsController } from '@api/persons/persons.controller';
import { PersonsService } from '@application/persons/persons.service';
import { PERSON_REPOSITORY } from '@domain/persons/person.repository';
import { InMemoryPersonRepository } from '@infrastructure/persons/repositories/in-memory-person.repository';

@Module({
  controllers: [PersonsController],
  providers: [
    PersonsService,
    InMemoryPersonRepository,
    {
      provide: PERSON_REPOSITORY,
      useExisting: InMemoryPersonRepository,
    },
  ],
})
export class PersonsModule {}
