
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { petNamesTable } from '../db/schema';
import { type AddPetNameInput } from '../schema';
import { addPetName } from '../handlers/add_pet_name';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: AddPetNameInput = {
  name: 'Fluffy',
  type: 'cat'
};

describe('addPetName', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should add a pet name', async () => {
    const result = await addPetName(testInput);

    // Basic field validation
    expect(result.name).toEqual('Fluffy');
    expect(result.type).toEqual('cat');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save pet name to database', async () => {
    const result = await addPetName(testInput);

    // Query using proper drizzle syntax
    const petNames = await db.select()
      .from(petNamesTable)
      .where(eq(petNamesTable.id, result.id))
      .execute();

    expect(petNames).toHaveLength(1);
    expect(petNames[0].name).toEqual('Fluffy');
    expect(petNames[0].type).toEqual('cat');
    expect(petNames[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle different pet types', async () => {
    const dogInput: AddPetNameInput = {
      name: 'Rex',
      type: 'dog'
    };

    const result = await addPetName(dogInput);

    expect(result.name).toEqual('Rex');
    expect(result.type).toEqual('dog');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should handle special characters in names', async () => {
    const specialInput: AddPetNameInput = {
      name: "Mr. Whiskers O'Malley",
      type: 'cat'
    };

    const result = await addPetName(specialInput);

    expect(result.name).toEqual("Mr. Whiskers O'Malley");
    expect(result.type).toEqual('cat');
    
    // Verify it was saved correctly to database
    const savedPetNames = await db.select()
      .from(petNamesTable)
      .where(eq(petNamesTable.id, result.id))
      .execute();

    expect(savedPetNames[0].name).toEqual("Mr. Whiskers O'Malley");
  });
});
