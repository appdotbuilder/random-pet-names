
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { petNamesTable } from '../db/schema';
import { type GeneratePetNameInput } from '../schema';
import { generatePetNames } from '../handlers/generate_pet_names';

// Test inputs
const testInputDefault: GeneratePetNameInput = {
  count: 1
};

const testInputWithType: GeneratePetNameInput = {
  type: 'dog',
  count: 3
};

const testInputMultiple: GeneratePetNameInput = {
  count: 5
};

describe('generatePetNames', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should generate one pet name by default', async () => {
    const result = await generatePetNames(testInputDefault);
    
    expect(result).toHaveLength(1);
    expect(result[0].name).toBeDefined();
    expect(result[0].type).toBeDefined();
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should generate multiple pet names when count is specified', async () => {
    const result = await generatePetNames(testInputMultiple);
    
    expect(result).toHaveLength(5);
    result.forEach(petName => {
      expect(petName.name).toBeDefined();
      expect(petName.type).toBeDefined();
      expect(petName.id).toBeDefined();
      expect(petName.created_at).toBeInstanceOf(Date);
    });
  });

  it('should filter by type when specified', async () => {
    // First add some test data to database
    await db.insert(petNamesTable).values([
      { name: 'Rex', type: 'dog' },
      { name: 'Whiskers', type: 'cat' },
      { name: 'Buddy', type: 'dog' }
    ]).execute();

    const result = await generatePetNames(testInputWithType);
    
    expect(result).toHaveLength(3);
    result.forEach(petName => {
      expect(petName.type).toEqual('dog');
      expect(petName.name).toBeDefined();
      expect(petName.id).toBeDefined();
      expect(petName.created_at).toBeInstanceOf(Date);
    });
  });

  it('should use fallback names when database is empty', async () => {
    // Database is empty after setup
    const result = await generatePetNames(testInputDefault);
    
    expect(result).toHaveLength(1);
    expect(result[0].name).toBeDefined();
    expect(result[0].type).toEqual('other'); // Default type when not specified
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should use fallback names with specified type when database is empty', async () => {
    const inputWithSpecificType: GeneratePetNameInput = {
      type: 'cat',
      count: 2
    };
    
    const result = await generatePetNames(inputWithSpecificType);
    
    expect(result).toHaveLength(2);
    result.forEach(petName => {
      expect(petName.type).toEqual('cat');
      expect(petName.name).toBeDefined();
      expect(petName.id).toBeDefined();
      expect(petName.created_at).toBeInstanceOf(Date);
    });
  });

  it('should return database names when available', async () => {
    // Add test data
    await db.insert(petNamesTable).values([
      { name: 'DatabaseDog', type: 'dog' },
      { name: 'DatabaseCat', type: 'cat' }
    ]).execute();

    const result = await generatePetNames({ count: 1 });
    
    expect(result).toHaveLength(1);
    expect(['DatabaseDog', 'DatabaseCat']).toContain(result[0].name);
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });
});
