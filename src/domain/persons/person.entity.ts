export class Person {
  constructor(
    public readonly id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public isActive: boolean,
    public readonly createdAt: Date,
  ) {}
}
