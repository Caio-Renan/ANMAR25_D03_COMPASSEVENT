import { BadRequestException } from '@nestjs/common';
import { PersonName } from '../../../src/common/value-objects/person-name.vo';

describe('PersonName', () => {
  it('should throw if name is not a string', () => {
    expect(() => new PersonName(null as any)).toThrow(BadRequestException);
    expect(() => new PersonName(undefined as any)).toThrow(BadRequestException);
    expect(() => new PersonName(123 as any)).toThrow(BadRequestException);
    expect(() => new PersonName(true as any)).toThrow(BadRequestException);
    expect(() => new PersonName({} as any)).toThrow(BadRequestException);
  });

  it('should throw if name is empty or only spaces', () => {
    expect(() => new PersonName('')).toThrow(BadRequestException);
    expect(() => new PersonName('    ')).toThrow(BadRequestException);
  });

  it('should throw if name is longer than 100 characters', () => {
    const longName = 'a'.repeat(101);
    expect(() => new PersonName(longName)).toThrow(BadRequestException);
  });

  it('should throw if name contains invalid characters', () => {
    expect(() => new PersonName('John123')).toThrow(BadRequestException);
    expect(() => new PersonName('John@Doe')).toThrow(BadRequestException);
    expect(() => new PersonName('Jane_Doe')).toThrow(BadRequestException);
    expect(() => new PersonName('Name!')).toThrow(BadRequestException);
  });

  it('should accept valid names and normalize spaces', () => {
    const rawName = '  João   da Silva   ';
    const instance = new PersonName(rawName);
    expect(instance.value).toBe('João da Silva');
    expect(instance.toString()).toBe('João da Silva');
  });

  it('should accept names with apostrophes, dots and hyphens', () => {
    const names = ["O'Connor", 'Anne-Marie', 'Dr. John Smith', "D'Arcy", 'Jean-Luc Picard'];

    for (const name of names) {
      expect(() => new PersonName(name)).not.toThrow();
    }
  });
});
