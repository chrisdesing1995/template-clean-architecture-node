import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreatePersonDto } from '@application/persons/dtos/create-person.dto';
import type { PersonResponseDto } from '@application/persons/dtos/person-response.dto';
import { UpdatePersonDto } from '@application/persons/dtos/update-person.dto';
import { PersonsMapper } from '@application/persons/persons.mapper';
import { Person } from '@domain/persons/person.entity';
import { PERSON_REPOSITORY, type PersonRepository } from '@domain/persons/person.repository';

@Injectable()
export class PersonsService {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepository,
  ) {}

  async findAll(): Promise<PersonResponseDto[]> {
    const persons = await this.personRepository.findAll();

    return persons.map((person) => PersonsMapper.toResponse(person));
  }

  async findById(id: string): Promise<PersonResponseDto> {
    const person = await this.personRepository.findById(id);

    if (!person) {
      throw new NotFoundException(`Person with id "${id}" was not found.`);
    }

    return PersonsMapper.toResponse(person);
  }

  async create(payload: CreatePersonDto): Promise<PersonResponseDto> {
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
  }

  async update(id: string, payload: UpdatePersonDto): Promise<PersonResponseDto> {
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
  }

  async delete(id: string): Promise<void> {
    const person = await this.personRepository.findById(id);

    if (!person) {
      throw new NotFoundException(`Person with id "${id}" was not found.`);
    }

    await this.personRepository.delete(id);
  }
}
