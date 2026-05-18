import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreatePersonDto } from '@application/persons/dtos/create-person.dto';
import type { PersonResponseDto } from '@application/persons/dtos/person-response.dto';
import { UpdatePersonDto } from '@application/persons/dtos/update-person.dto';
import { PersonsMapper } from '@application/persons/persons.mapper';
import { Person } from '@domain/persons/person.entity';
import { PERSON_REPOSITORY, type PersonRepository } from '@domain/persons/person.repository';
import { ExecutionService } from '@shared/logging/execution.service';

@Injectable()
export class PersonsService {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepository,
    private readonly executionService: ExecutionService,
  ) {}

  async findAll(): Promise<PersonResponseDto[]> {
    return this.executionService.executeAsync(
      'FindAllPersons',
      'Starting persons retrieval.',
      'Persons retrieved successfully.',
      'Error retrieving persons.',
      async () => {
        const persons = await this.personRepository.findAll();

        return persons.map((person) => PersonsMapper.toResponse(person));
      },
    );
  }

  async findById(id: string): Promise<PersonResponseDto> {
    return this.executionService.executeAsync(
      'FindPersonById',
      'Starting person lookup.',
      'Person retrieved successfully.',
      'Error retrieving person.',
      async () => {
        const person = await this.personRepository.findById(id);

        if (!person) {
          throw new NotFoundException(`Person with id "${id}" was not found.`);
        }

        return PersonsMapper.toResponse(person);
      },
      { id },
    );
  }

  async create(payload: CreatePersonDto): Promise<PersonResponseDto> {
    return this.executionService.executeAsync(
      'CreatePerson',
      'Starting person creation.',
      'Person created successfully.',
      'Error creating person.',
      async () => {
        const existingPerson = await this.personRepository.findByEmail(payload.email);

        if (existingPerson) {
          throw new ConflictException(`Person with email "${payload.email}" already exists.`);
        }

        const person = new Person(
          randomUUID(),
          payload.firstName,
          payload.lastName,
          payload.email,
          true,
          new Date(),
        );

        const createdPerson = await this.personRepository.create(person);

        return PersonsMapper.toResponse(createdPerson);
      },
      payload,
    );
  }

  async update(id: string, payload: UpdatePersonDto): Promise<PersonResponseDto> {
    return this.executionService.executeAsync(
      'UpdatePerson',
      'Starting person update.',
      'Person updated successfully.',
      'Error updating person.',
      async () => {
        const person = await this.personRepository.findById(id);

        if (!person) {
          throw new NotFoundException(`Person with id "${id}" was not found.`);
        }

        if (payload.email && payload.email !== person.email) {
          const existingPerson = await this.personRepository.findByEmail(payload.email);

          if (existingPerson) {
            throw new ConflictException(`Person with email "${payload.email}" already exists.`);
          }
        }

        person.firstName = payload.firstName ?? person.firstName;
        person.lastName = payload.lastName ?? person.lastName;
        person.email = payload.email ?? person.email;

        const updatedPerson = await this.personRepository.update(person);

        return PersonsMapper.toResponse(updatedPerson);
      },
      { id, payload },
    );
  }

  async delete(id: string): Promise<void> {
    await this.executionService.executeAsync(
      'DeletePerson',
      'Starting person deletion.',
      'Person deleted successfully.',
      'Error deleting person.',
      async () => {
        const person = await this.personRepository.findById(id);

        if (!person) {
          throw new NotFoundException(`Person with id "${id}" was not found.`);
        }

        await this.personRepository.delete(id);
      },
      { id },
    );
  }
}
