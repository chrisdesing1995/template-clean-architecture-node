import type { Person } from '@domain/persons/person.entity';

export const PERSON_REPOSITORY = Symbol('PERSON_REPOSITORY');

export interface PersonRepository {
  findAll(): Promise<Person[]>;
  findById(id: string): Promise<Person | null>;
  findByEmail(email: string): Promise<Person | null>;
  create(person: Person): Promise<Person>;
  update(person: Person): Promise<Person>;
  delete(id: string): Promise<void>;
}
