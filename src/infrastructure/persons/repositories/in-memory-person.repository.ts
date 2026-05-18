import { Injectable } from '@nestjs/common';
import type { Person } from '@domain/persons/person.entity';
import type { PersonRepository } from '@domain/persons/person.repository';

@Injectable()
export class InMemoryPersonRepository implements PersonRepository {
  private readonly persons: Person[] = [];

  findAll(): Promise<Person[]> {
    return Promise.resolve([...this.persons]);
  }

  findById(id: string): Promise<Person | null> {
    return Promise.resolve(this.persons.find((person) => person.id === id) ?? null);
  }

  findByEmail(email: string): Promise<Person | null> {
    return Promise.resolve(this.persons.find((person) => person.email === email) ?? null);
  }

  create(person: Person): Promise<Person> {
    this.persons.push(person);

    return Promise.resolve(person);
  }

  update(person: Person): Promise<Person> {
    const index = this.persons.findIndex((currentPerson) => currentPerson.id === person.id);

    if (index >= 0) {
      this.persons[index] = person;
    }

    return Promise.resolve(person);
  }

  delete(id: string): Promise<void> {
    const index = this.persons.findIndex((person) => person.id === id);

    if (index >= 0) {
      this.persons.splice(index, 1);
    }

    return Promise.resolve();
  }
}
