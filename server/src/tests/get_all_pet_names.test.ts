
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { petNamesTable } from '../db/schema';
import { getAllPetNames } from '../handlers/get_all_pet_names';

describe('getAllPetNames', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no pet names exist', async () => {
    const result = await getAllPetNames();
    
    expect(result).toEqual([]);
  });

  it('should return all pet names from database', async () => {
    // Insert test data
    await db.insert(petNamesTable)
      .values([
        { name: 'Buddy', type: 'dog' },
        { name: 'Whiskers', type: 'cat' },
        { name: 'Tweety', type: 'bird' }
      ])
      .execute();

    const result = await getAllPetNames();

    expect(result).toHaveLength(3);
    
    // Check that all names are returned
    const names = result.map(pet => pet.name);
    expect(names).toContain('Buddy');
    expect(names).toContain('Whiskers');
    expect(names).toContain('Tweety');

    // Verify structure of returned objects
    result.forEach(pet => {
      expect(pet.id).toBeDefined();
      expect(typeof pet.name).toBe('string');
      expect(['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other']).toContain(pet.type);
      expect(pet.created_at).toBeInstanceOf(Date);
    });
  });

  it('should return pet names with correct types', async () => {
    // Insert pets of different types
    await db.insert(petNamesTable)
      .values([
        { name: 'Rex', type: 'dog' },
        { name: 'Nemo', type: 'fish' },
        { name: 'Fluffy', type: 'rabbit' }
      ])
      .execute();

    const result = await getAllPetNames();

    expect(result).toHaveLength(3);

    const dogPet = result.find(pet => pet.name === 'Rex');
    const fishPet = result.find(pet => pet.name === 'Nemo');
    const rabbitPet = result.find(pet => pet.name === 'Fluffy');

    expect(dogPet?.type).toBe('dog');
    expect(fishPet?.type).toBe('fish');
    expect(rabbitPet?.type).toBe('rabbit');
  });
});
