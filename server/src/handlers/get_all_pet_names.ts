
import { db } from '../db';
import { petNamesTable } from '../db/schema';
import { type PetName } from '../schema';

export async function getAllPetNames(): Promise<PetName[]> {
  try {
    const results = await db.select()
      .from(petNamesTable)
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch all pet names:', error);
    throw error;
  }
}
